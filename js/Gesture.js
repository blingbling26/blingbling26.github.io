/**
 * 通用手势识别控制脚本
 * 功能：
 * 1. 手掌作为鼠标指针
 * 2. 拳头可以滑动页面
 * 3. 握拳动作作为点击
 */

// MediaPipe 依赖
const loadDependencies = () => {
  return new Promise((resolve) => {
    // 检查是否已加载
    if (window.Hands) {
      resolve();
      return;
    }

    const scripts = [
      "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.js"
    ];

    let loaded = 0;
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        loaded++;
        if (loaded === scripts.length) {
          resolve();
        }
      };
      document.head.appendChild(script);
    });
  });
};

class GestureController {
  constructor(options = {}) {
    this.options = {
      showVideo: false,
      videoSize: { width: 200, height: 150 },
      canvasSize: { width: 640, height: 480 },
      cursorSize: 20,
      cursorColor: '#FF0000',
      ...options
    };

    this.isActive = false;
    this.videoElement = null;
    this.handCanvas = null;
    this.handCtx = null;
    this.hands = null;
    this.camera = null;
    this.cursor = null;
    
    // 手势状态
    this.gestureState = {
      isPointing: false,
      isFist: false,
      lastPosition: { x: 0, y: 0 },
      scrollStartPosition: { x: 0, y: 0 },
      isScrolling: false,
      clickStartTime: 0,
      isClickGesture: false
    };
    
    // 手势检测阈值
    this.thresholds = {
      fistThreshold: 0.1,      // 拳头检测阈值
      clickDuration: 300,      // 点击手势持续时间 (ms)
      scrollThreshold: 30      // 滚动阈值 (px)
    };
  }

  async init() {
    await loadDependencies();
    this._createElements();
    await this._initHandTracking();
    this._createCursor();
    this.isActive = true;
    console.log('手势控制已初始化');
    return this;
  }

  _createElements() {
    // 创建视频元素
    this.videoElement = document.createElement('video');
    this.videoElement.autoplay = true;
    this.videoElement.playsInline = true;
    this.videoElement.style.transform = 'scaleX(-1)';
    
    if (this.options.showVideo) {
      this.videoElement.style.position = 'fixed';
      this.videoElement.style.bottom = '10px';
      this.videoElement.style.right = '10px';
      this.videoElement.style.width = `${this.options.videoSize.width}px`;
      this.videoElement.style.height = `${this.options.videoSize.height}px`;
      this.videoElement.style.zIndex = '9999';
      this.videoElement.style.borderRadius = '8px';
      this.videoElement.style.border = '2px solid #333';
      document.body.appendChild(this.videoElement);
    } else {
      this.videoElement.style.display = 'none';
    }

    // 创建手部跟踪画布
    this.handCanvas = document.createElement('canvas');
    this.handCanvas.width = this.options.canvasSize.width;
    this.handCanvas.height = this.options.canvasSize.height;
    this.handCanvas.style.display = 'none';
    document.body.appendChild(this.handCanvas);
    this.handCtx = this.handCanvas.getContext('2d');
  }

  _createCursor() {
    // 创建自定义光标
    this.cursor = document.createElement('div');
    this.cursor.style.position = 'fixed';
    this.cursor.style.width = `${this.options.cursorSize}px`;
    this.cursor.style.height = `${this.options.cursorSize}px`;
    this.cursor.style.borderRadius = '50%';
    this.cursor.style.backgroundColor = this.options.cursorColor;
    this.cursor.style.transform = 'translate(-50%, -50%)';
    this.cursor.style.pointerEvents = 'none'; // 确保光标不会干扰点击事件
    this.cursor.style.zIndex = '10000';
    this.cursor.style.opacity = '0.7';
    this.cursor.style.transition = 'background-color 0.2s ease';
    document.body.appendChild(this.cursor);
  }

  async _initHandTracking() {
    // 初始化MediaPipe Hands
    this.hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    // 配置手部跟踪参数
    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    // 处理手部检测结果
    this.hands.onResults((results) => this._handleHandResults(results));
  }

  async start() {
    if (!this.isActive) {
      await this.init();
    }
    
    if (!this._checkMediaSupport()) return;

    try {
      // 请求摄像头权限
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: this.options.canvasSize.width },
          height: { ideal: this.options.canvasSize.height },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        }
      });

      // 设置视频源
      this.videoElement.srcObject = stream;
      
      // 等待视频加载完成
      await new Promise((resolve) => {
        this.videoElement.onloadedmetadata = () => {
          this.videoElement.play().then(resolve);
        };
      });

      // 创建并启动MediaPipe相机
      this.camera = new Camera(this.videoElement, {
        onFrame: async () => {
          try {
            await this.hands.send({image: this.videoElement});
          } catch (error) {
            console.error('手部检测错误:', error);
          }
        },
        width: this.options.canvasSize.width,
        height: this.options.canvasSize.height
      });

      await this.camera.start();
      console.log('手势控制已启动');
    } catch (error) {
      console.error('摄像头设置错误:', error);
      alert('摄像头访问失败！请确保:\n1. 允许浏览器访问摄像头\n2. 摄像头未被其他程序占用\n3. 摄像头已正确连接');
    }
  }

  stop() {
    if (this.camera) {
      this.camera.stop();
    }
    
    if (this.videoElement && this.videoElement.srcObject) {
      const tracks = this.videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.videoElement.srcObject = null;
    }
    
    if (this.cursor) {
      this.cursor.style.display = 'none';
    }
    
    console.log('手势控制已停止');
  }
  _handleHandResults(results) {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      // 没有检测到手，隐藏光标
      this.cursor.style.display = 'none';
      this.gestureState.isPointing = false;
      this.gestureState.isFist = false;
      return;
    }
  
    const landmarks = results.multiHandLandmarks[0];
    // 计算手掌中心点（使用食指根部和中指根部的中点）
    const indexFingerBase = landmarks[5];
    const middleFingerBase = landmarks[9];
    const palmCenter = {
      x: (indexFingerBase.x + middleFingerBase.x) / 2,
      y: (indexFingerBase.y + middleFingerBase.y) / 2
    };
    
    // 检测手势类型
    const gesture = this._detectGesture(landmarks);
    
    // 在视频上绘制手部关键点和连接线
    if (this.handCtx) {
      // 清除画布
      this.handCtx.clearRect(0, 0, this.handCanvas.width, this.handCanvas.height);
      
      // 绘制手部关键点和连接线
      if (window.drawConnectors && window.drawLandmarks && window.HAND_CONNECTIONS) {
        window.drawConnectors(
          this.handCtx, landmarks, window.HAND_CONNECTIONS,
          {color: '#00FF00', lineWidth: 3}
        );
        window.drawLandmarks(
          this.handCtx, landmarks,
          {color: '#FF0000', lineWidth: 2, radius: 4}
        );
        
        // 特别标记手掌中心点
        this.handCtx.beginPath();
        this.handCtx.arc(
          palmCenter.x * this.handCanvas.width,
          palmCenter.y * this.handCanvas.height,
          8, 0, 2 * Math.PI
        );
        this.handCtx.fillStyle = '#FFFF00';
        this.handCtx.fill();
      }
      
      // 显示画布
      this.handCanvas.style.display = 'block';
      this.handCanvas.style.position = 'fixed';
      this.handCanvas.style.bottom = '10px';
      this.handCanvas.style.right = '10px';
      this.handCanvas.style.width = `${this.options.videoSize.width}px`;
      this.handCanvas.style.height = `${this.options.videoSize.height}px`;
      this.handCanvas.style.zIndex = '9998';
      this.handCanvas.style.borderRadius = '8px';
      this.handCanvas.style.border = '2px solid #333';
    }
    
    // 更新光标位置
    this._updateCursorPosition(palmCenter, gesture);
    
    // 处理手势动作
    this._handleGestureActions(palmCenter, gesture);
  }
  _detectGesture(landmarks) {
    // 检测是否是拳头
    // 计算指尖到手掌的距离
    const palmBase = landmarks[0]; // 手掌基部
    
    // 检查所有手指的弯曲程度
    const fingerTips = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]]; // 拇指、食指、中指、无名指、小指指尖
    const fingerBases = [landmarks[2], landmarks[5], landmarks[9], landmarks[13], landmarks[17]]; // 对应的指根部
    
    let fingersExtended = 0;
    
    // 检查每个手指是否伸展
    for (let i = 0; i < fingerTips.length; i++) {
      const tipToBase = this._distance3D(fingerTips[i], fingerBases[i]);
      const baseToWrist = this._distance3D(fingerBases[i], palmBase);
      
      // 如果指尖到指根的距离大于指根到手腕的距离的一定比例，认为手指是伸展的
      if (tipToBase > baseToWrist * this.thresholds.fistThreshold) {
        fingersExtended++;
      }
    }
    
    // 根据伸展的手指数量判断手势
    if (fingersExtended <= 1) {
      return 'fist'; // 拳头或只有拇指伸出
    } else if (fingersExtended === 2 && this._distance3D(landmarks[8], palmBase) > this._distance3D(landmarks[5], palmBase) * 1.5) {
      return 'pointing'; // 指向（食指伸出）
    } else {
      return 'open'; // 张开的手
    }
  }

  _updateCursorPosition(palmCenter, gesture) {
    // 显示光标
    this.cursor.style.display = 'block';
    
    // 将手掌位置映射到屏幕坐标
    const screenX = palmCenter.x * window.innerWidth;
    const screenY = palmCenter.y * window.innerHeight;
    
    // 更新光标位置
    this.cursor.style.left = `${screenX}px`;
    this.cursor.style.top = `${screenY}px`;
    
    // 根据手势更新光标样式
    if (gesture === 'fist') {
      this.cursor.style.backgroundColor = '#FF0000'; // 红色表示拳头
      this.cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    } else if (gesture === 'pointing') {
      this.cursor.style.backgroundColor = '#00FF00'; // 绿色表示指向
      this.cursor.style.transform = 'translate(-50%, -50%) scale(1.2)';
    } else {
      this.cursor.style.backgroundColor = this.options.cursorColor; // 默认颜色
      this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  }

  _handleGestureActions(palmCenter, gesture) {
    const currentPosition = {
      x: palmCenter.x * window.innerWidth,
      y: palmCenter.y * window.innerHeight
    };
    // 处理拳头手势（滚动）
    if (gesture === 'fist') {
      if (!this.gestureState.isFist) {
        // 拳头手势开始
        this.gestureState.isFist = true;
        this.gestureState.scrollStartPosition = { ...currentPosition };
        this.gestureState.isScrolling = false;
      } else {
        // 拳头手势持续中
        const deltaY = currentPosition.y - this.gestureState.scrollStartPosition.y;
        
        // 如果移动距离超过阈值，开始滚动
        if (Math.abs(deltaY) > this.thresholds.scrollThreshold) {
          this.gestureState.isScrolling = true;
          window.scrollBy(0, deltaY / 5); // 除以5使滚动更平滑
          this.gestureState.scrollStartPosition = { ...currentPosition };
        }
      }
    } else {
      this.gestureState.isFist = false;
      this.gestureState.isScrolling = false;
    }
    // 处理握拳点击手势（从张开到拳头的快速变化）
        if (gesture === 'open') {
          this.gestureState.isPointing = false;
          
          // 重置点击状态
          if (this.gestureState.isClickGesture) {
            this.gestureState.isClickGesture = false;
          }
        } else if (gesture === 'pointing') {
          if (!this.gestureState.isPointing) {
            // 指向手势开始
            this.gestureState.isPointing = true;
            this.gestureState.clickStartTime = Date.now();
          } else {
            // 指向手势持续中
            const pointingDuration = Date.now() - this.gestureState.clickStartTime;
            
            // 如果指向持续时间超过阈值，触发点击
            if (pointingDuration > this.thresholds.clickDuration && !this.gestureState.isClickGesture) {
              this._triggerClick(currentPosition.x, currentPosition.y);
              this.gestureState.isClickGesture = true;
            }
          }
        } else {
          this.gestureState.isPointing = false;
          // 删除下面这行重复代码
          // this.gestureState.isPointing = false;
        }
    
    // 更新上一次位置
    this.gestureState.lastPosition = { ...currentPosition };
  }

  _triggerClick(x, y) {
    // 创建并触发点击事件
    const element = document.elementFromPoint(x, y);
    if (element) {
      // 闪烁光标以提供视觉反馈
      this.cursor.style.backgroundColor = '#FFFF00';
      setTimeout(() => {
        this.cursor.style.backgroundColor = this.options.cursorColor;
      }, 200);
      
      // 触发点击事件
      element.click();
      console.log('点击元素:', element);
    }
  }

  _distance3D(a, b) {
    // 计算两点之间的3D距离
    return Math.sqrt(
      Math.pow(a.x - b.x, 2) + 
      Math.pow(a.y - b.y, 2) + 
      Math.pow(a.z - b.z, 2)
    );
  }

  _checkMediaSupport() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('您的浏览器不支持摄像头访问，请使用现代浏览器（如 Chrome、Firefox、Edge 等）');
      return false;
    }
    return true;
  }
}

// 创建一个全局实例，方便在任何页面中使用
let gestureController = null;

// 添加启动和停止手势控制的函数
function startGestureControl(options = {}) {
  if (!gestureController) {
    // 默认显示视频和手部跟踪
    const defaultOptions = {
      showVideo: true,
      videoSize: { width: 200, height: 150 }
    };
    gestureController = new GestureController({...defaultOptions, ...options});
  }
  gestureController.start();
  return gestureController;
}
function stopGestureControl() {
  if (gestureController) {
    gestureController.stop();
  }
}
// 添加一个简单的UI控制按钮
function addGestureControlButton() {
  const button = document.createElement('button');
  button.textContent = '启用手势控制';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.left = '20px';
  button.style.zIndex = '10001';
  button.style.padding = '5px 8px'; // 更小的内边距
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  button.style.fontSize = '12px'; // 更小的字体
  button.style.fontWeight = 'bold'; // 加粗字体
  button.dataset.gestureControl = 'true'; // 添加标识属性
  
  let isActive = false;
  
  button.onclick = function() {
    if (isActive) {
      stopGestureControl();
      button.textContent = '启用手势控制';
      button.style.backgroundColor = '#4CAF50';
      isActive = false;
    } else {
      startGestureControl();
      button.textContent = '停用手势控制';
      button.style.backgroundColor = '#F44336';
      isActive = true;
    }
  };
  
  document.body.appendChild(button);
}
// 在页面加载完成后添加控制按钮
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addGestureControlButton);
} else {
  addGestureControlButton();
}

// 确保全局可访问
window.GestureController = GestureController;
window.startGestureControl = startGestureControl;
window.stopGestureControl = stopGestureControl;
window.addGestureControlButton = addGestureControlButton;
