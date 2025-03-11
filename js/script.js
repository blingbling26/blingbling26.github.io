document.addEventListener("DOMContentLoaded", () => {
    const object = document.getElementById("object");
    const container = document.getElementById("container");

    // 初始化Hammer.js手势识别
    const hammer = new Hammer(container);

    // 手势滑动（平移）
    hammer.on("pan", (event) => {
        const currentTransform = object.style.transform || "translate(0px, 0px) scale(1)";
        const [translateX, translateY, scale] = currentTransform.match(/translate\(([^,]+)px, ([^)]+)px\) scale\(([^)]+)\)/).slice(1).map(Number);

        const newX = translateX + event.deltaX;
        const newY = translateY + event.deltaY;

        object.style.transform = `translate(${newX}px, ${newY}px) scale(${scale})`;
    });

    // 手指的捏合与放大（缩放）
    hammer.on("pinch", (event) => {
        const currentTransform = object.style.transform || "translate(0px, 0px) scale(1)";
        const [translateX, translateY, scale] = currentTransform.match(/translate\(([^,]+)px, ([^)]+)px\) scale\(([^)]+)\)/).slice(1).map(Number);

        const newScale = scale * event.scale;

        object.style.transform = `translate(${translateX}px, ${translateY}px) scale(${newScale})`;
    });

    // 双手合十（形变，这里简单实现旋转效果）
    hammer.on("rotate", (event) => {
        const currentTransform = object.style.transform || "translate(0px, 0px) scale(1)";
        const [translateX, translateY, scale] = currentTransform.match(/translate\(([^,]+)px, ([^)]+)px\) scale\(([^)]+)\)/).slice(1).map(Number);

        const rotation = event.rotation;

        object.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotation}deg)`;
    });
});
