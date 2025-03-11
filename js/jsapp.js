// 搜索功能实现
document.getElementById('searchButton').addEventListener('click', searchTool);
document.getElementById('searchBox').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') searchTool();
});

// 存储当前高亮元素
let currentHighlight = null;

function searchTool() {
    const searchTerm = document.getElementById('searchBox').value.trim();
    const searchMessage = document.getElementById('searchMessage');
    const allTools = document.querySelectorAll('.tool-item');
    let found = false;

    // 清除旧的高亮和消息
    if(currentHighlight) {
        currentHighlight.style.border = '';
        currentHighlight.scrollIntoView({behavior: "smooth"});
    }
    searchMessage.style.display = 'none';

    // 遍历所有神器
    allTools.forEach(tool => {
        const toolName = tool.querySelector('button').textContent;
        if(toolName.includes(searchTerm)) {
            // 滚动到目标位置
            tool.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // 添加高亮边框
            tool.style.border = '3px solid #FFD700';
            tool.style.transition = 'border 0.3s ease';
            tool.style.borderRadius = '10px';
            tool.style.boxShadow = '0 0 15px rgba(255,215,0,0.5)';
            
            currentHighlight = tool;
            found = true;
            
            // 5秒后取消高亮
            setTimeout(() => {
                tool.style.border = '';
                tool.style.boxShadow = '';
            }, 5000);
        }
    });

    // 显示未找到提示
    if(!found) {
        searchMessage.style.display = 'block';
        setTimeout(() => {
            searchMessage.style.display = 'none';
        }, 2000);
    }
}

// 点击任意神器时同步搜索框
document.querySelectorAll('.tool-item button').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('searchBox').value = this.textContent;
        searchTool();
    });
});

document.getElementById('magicTool1').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>筋斗云 Somersault cloud</h4>
        <p>主人：孙悟空<p>
        <p>首次出现章节：第三回  四海千山皆拱伏 九幽十类尽除名</p>
        <p>交互方式：语音交互 动作交互</p>
        <p>交互描述：他就捻起诀来，念动咒语，向巽地上吸一口气，呼的吹将去，便是一阵狂风，飞沙走石，好惊人也。<p>
        <video width="640" height="360" controls>
            <source src="video/筋斗云.mp4" type="video/mp4">
        </video>
    `;
});

document.getElementById('magicTool2').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>金钢琢（金钢套）Diamond Jade </h4>
        <p>主人：太上老君（青牛精偷了用，在五十回左右）<p>
        <p>首次出现章节：第六回  观音赴会问原因 小圣施威降大圣</p>
        <p>交互方式：动作交互 自适应交互</p>
        <p>交互描述：老君道：“有，有，有。”捋起衣袖，左膊上取下一个圈子，说道：“这件兵器，乃锟钢抟炼的，被我将还丹点成，养就一身灵气，善能变化，水火不侵，又能套诸物。一名‘金钢琢’，又名‘金钢套’。当年过函关，化胡为佛，甚是亏他。早晚最可防身。等我丢下去打他一下。”<p>
    `;
});

document.getElementById('magicTool3').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>紧箍儿 tight bands</h4>
        <p>主人：佛祖→观音→唐僧→孙悟空<p>
        <p>首次出现章节：第八回  我佛造经传极乐 观音奉旨上长安<p>
        <p>交互方式：语音交互 自适应交互</p>
        <p>交互描述：递与菩萨道：“此宝唤作‘紧箍儿’；虽是一样三个，但只用各不同。我有‘金紧禁’的咒语三篇。假若路上撞见神通广大的妖魔，你须是劝他学好，跟那取经人做个徒弟。他若不伏使唤，可将此箍儿与他戴在头上，自然见肉生根。各依所用的咒语念一念，眼胀头疼，脑门皆裂，管教他入我门来。”<p>
    `;
});

document.getElementById('magicTool4').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>九齿钉耙 Demon−quelling pole</h4>
        <p>主人：猪八戒<p>
        <p>首次出现章节：第八回  我佛造经传极乐 观音奉旨上长安</p>
        <p>交互方式：语音交互 自适应交互</p>
        <p>交互描述：好呆子，捻个诀，念个咒语，把腰躬一躬，叫：“长！”就长了有二十丈高下的身躯；把钉钯幌一幌，教：“变！”就变了有三十丈长短的钯柄；拽开步，双手使钯，将荆棘左右搂开：“请师父跟我来也！”<p>
    `;
});

document.getElementById('magicTool5').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>避火罩 Anti−fire Cover</h4>
        <p>主人：广目天王<p>
        <p>首次出现章节：第十六回  观音院僧谋宝贝　黑风山怪窃袈裟</p>
        <p>交互方式：空间交互 自适应交互</p>
        <p>交互描述：孙行者护住了后边方丈，辟火罩罩住了前面禅堂，其馀前后火光大发，真个是照天红焰辉煌，透壁金光照耀！<p>
        <p>却说行者取了辟火罩，一筋斗送上南天门，交与广目天王道：“谢借！谢借！”天王收了道：“大圣至诚了。我正愁你不还我的宝贝，无处寻讨，且喜就送来也。”<p>
    `;
});

document.getElementById('magicTool6').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>飞龙宝杖 Flying Dragon Staff</h4>
        <p>主人：如来→菩萨<p>
        <p>首次出现章节：第二十一回  护教设庄留大圣　须弥灵吉定风魔</p>
        <p>交互方式：语音交互 动作交互。</p>
        <p>交互描述：战不数合，那怪吊回头，望巽地上，才待要张口呼风，只见那半空里，灵吉菩萨将飞龙宝杖丢将下来，不知念了些甚么咒语，却是一条八爪金龙，拨喇的抡开两爪，一把抓住妖精，提着头，两三捽，捽在山石崖边，现了本相，却是一个黄毛貂鼠。<p>
    `;
});

document.getElementById('magicTool7').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>如意金箍棒 Iron、gold banded cudgel</h4>
        <p>主人：东海龙王赠孙悟空<p>
        <p>首次出现章节：第三回  四海千山皆拱伏 九幽十类尽除名</p>
        <p>交互方式：语音交互 自适应交互 动作交互</p>
        <p>交互描述：1. 乃是一根铁柱子，约有斗来粗，二丈有馀长。他尽力两手挝过道：“忒粗忒长些！再短细些方可用。”说毕，那宝贝就短了几尺，细了一围。悟空又颠一颠道：“再细些更好！”那宝贝真个又细了几分。<p>
        <p>2.一边走，一边心思口念，手颠着道：“再短细些更妙！”拿出外面，只有二丈长短，碗口粗细。<p>
        <p>3.又恐他无理来咬，即将铁棒取出，吹口仙气，叫：“变！”变作个枣核钉儿，撑住他的上腭子，把身一纵，跳出口外，就把铁棒顺手带出，把腰一躬，还是原身法像，举起棒来就打。<p>
        <video width="640" height="360" controls>
            <source src="video/金箍棒.mp4" type="video/mp4">
        </video>
    `;
});

document.getElementById('magicTool8').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>紫金红葫芦 Red gourd </h4>
        <p>主人：金角大王 银角大王（盗取太上老君）<p>
        <p>首次出现章节：第三十三回  外道迷真性 元神助本心<p>
        <p>交互方式：语音交互 空间交互</p>
        <p>交互描述：那怪道：“师父，不须你助功。我二大王有些法术，遣了三座大山把他压在山下，寸步难移，教我两个拿宝贝来装他的。”行者道：“是甚宝贝？”精细鬼道：“我的是红葫芦，他的是玉净瓶。”行者道：“怎么样装他？”小妖道：“把这宝贝的底儿朝天，口儿朝地，叫他一声，他若应了，就装在里面，贴上一张‘太上老君急急如律令奉敕’的帖子，他就一时三刻化为脓了。”<p>
    `;
});

document.getElementById('magicTool9').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>羊脂玉净瓶  Jade vase</h4>
        <p>主人：金角大王 银角大王（盗取太上老君）<p>
        <p>首次出现章节：第三十三回  外道迷真性 元神助本心<p>
        <p>交互方式：语音交互 空间交互</p>
        <p>交互描述：大圣见了，急纵云跳在空中，解下净瓶，罩定老魔，叫声：“金角大王。”那怪只道是自家败残的小妖呼叫，就回头应了一声，嗖的装将进去，被行者贴上“太上老君急急如律令奉敕”的帖子。<p>
    `;
});

document.getElementById('magicTool10').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>幌金绳 Rope</h4>
        <p>主人：金角大王 银角大王（盗取太上老君）<p>
        <p>首次出现章节：第三十四回  魔头巧算困心猿　大圣腾那骗宝贝</p>
        <p>交互方式：语音交互 自适应交互</p>
        <p>交互描述：原来那魔头有个《紧绳咒》，有个《松绳咒》，若扣住别人，就念《紧绳咒》，莫能得脱，若扣住自家人，就念《松绳咒》，不得伤身。他认得是自家的宝贝，即念《松绳咒》，把绳松动，便脱出来，反望行者抛将去，却早扣住了大圣。大圣正要使“瘦身法”，想要脱身，却被那魔念动《紧绳咒》，紧紧扣住，怎能得脱？褪至颈项之下，原是一个金圈子套住。那怪将绳一扯<p>
    `;
});

document.getElementById('magicTool11').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>照妖镜 Demon−revealing mirror</h4>
        <p>主人：文殊菩萨<p>
        <p>首次出现章节：第三十九回  一粒金丹天上得　三年故主世间生</p>
        <p>交互方式：其他交互</p>
        <p>交互描述：这大圣纵祥光，起在九霄，正欲下个切手，只见那东北上一朵彩云里面，厉声叫道：“孙悟空，且休下手！”行者回头看处，原来文殊菩萨。急收棒，上前施礼道：“菩萨，那里去？”文殊道：“我来替你收这个妖怪的。”行者谢道：“累烦了。”那菩萨袖中取出照妖镜，照住了那怪的原身。行者才招呼八戒、沙僧，齐来见了菩萨，却将镜子里看处，那魔王生得好不凶恶：眼似琉璃盏，头若炼砂缸。浑身三伏靛，四爪九秋霜。搭拉两个耳，一尾扫帚长。青毛生锐气，红眼放金光。匾牙排玉板，圆须挺硬枪。镜里观真像，原是文殊一个狮猁王。<p>
    `;
});

document.getElementById('magicTool12').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>阴阳二气瓶 The Male and Female Vital Principles Jar </h4>
        <p>主人：云程万里鹏（狮驼岭三大王、三魔）大鹏<p>
        <p>首次出现章节：第七十四回  长庚传报魔头狠　行者施为变化能</p>
        <p>交互方式：语音交互 空间交互</p>
        <p>交互描述：小钻风道：“我三大王不是凡间之怪物，名号云程万里鹏，行动时，抟风运海，振北图南。随身有一件儿宝贝，唤作‘阴阳二气瓶’。假若是把人装在瓶中，一时三刻，化为浆水。”<p>
    `;
});

document.getElementById('magicTool13').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>白玉盂儿 White jade bowl</h4>
        <p>主人：黄河水伯神王<p>
        <p>首次出现章节：第五十一回  心猿空用千般计　水火无功难炼魔<p>
        <p>交互方式：动作交互</p>
        <p>交互描述：水德闻言，即令黄河水伯神王：“随大圣去助功。”水伯自衣袖中取出一个白玉盂儿道：“我有此物盛水。”行者道：“看这盂儿能盛几何？妖魔如何淹得？”水伯道：“不瞒大圣说：我这一盂，乃是黄河之水。半盂就是半河，一盂就是一河。”行者喜道：“只消半盂足矣。”遂辞别水德，与黄河神急离天阙<p>
    `;
});

document.getElementById('magicTool14').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>芭蕉扇 Plantain−leaf fan </h4>
        <p>主人：铁扇公主<p>
        <p>首次出现章节：第五十九回  唐三藏路阻火焰山　孙行者一调芭蕉扇</p>
        <p>交互方式：语音交互 动作交互</p>
        <p>交互描述：那人道：“铁扇仙有柄芭蕉扇。求得来，一扇息火，二扇生风，三扇下雨，我们就布种，及时收割，故得五谷养生；不然，诚寸草不能生也。”行者闻言，急抽身走入里面，将糕递与三藏道：“师父放心，且莫隔年焦着，吃了糕，我与你说。”长老接糕在手，向本宅老者道：“公公请糕。”老者道：“我家的茶饭未奉，敢吃你糕？”行者笑道：“老人家，茶饭倒不必赐。我问你：铁扇仙在那里住？”老者道：“你问他怎的？”行者道：“适才那卖糕人说，此仙有柄芭蕉扇。求将来，一扇息火，二扇生风，三扇下雨，你这方布种收割，才得五谷养生。我欲寻他讨来扇息火焰山过去，且使这方依时收种，得安生也。”<p>
    `;
});

document.getElementById('magicTool15').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>金铙 Gold cymbals</h4>
        <p>主人：黄眉老祖<p>
        <p>首次出现章节：第六十五回  妖邪假设小雷音　四众皆遭大厄难</p>
        <p>交互方式：动作交互 自适应交互</p>
        <p>交互描述：双手抡棒，上前便打。只听得半空中叮一声，撇下一副金铙，把行者连头带足，合在金铙之内。慌得个猪八戒、沙和尚连忙使起钯杖，就被些阿罗、揭谛、圣僧、道者一拥近前围绕。他两个措手不及，尽被拿了。将三藏捉住，一齐都绳缠索绑，紧缚牢拴。<p>
    `;
});

document.getElementById('magicTool16').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>紫金铃 Golden Bells</h4>
        <p>主人：赛太岁（偷取观音的）<p>
        <p>首次出现章节：第七十回  妖魔宝放烟沙火　悟空计盗紫金铃</p>
        <p>交互方式：空间交互 动作交互。</p>
        <p>交互描述：好猴子，一把揝了三个铃儿，一齐摇起。你看那红火、青烟、黄沙，一齐滚出，骨都都燎树烧山！大圣口里又念个咒语，望巽地上叫：“风来！”真个是风催火势，火仗风威，红焰焰，黑沉沉，满天烟火，遍地黄沙！把那赛太岁唬得魄散魂飞，走投无路，在那火当中，怎逃性命！<p>
    `;
});

document.getElementById('magicTool17').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>定风丹 Wind−settling Pill</h4>
        <p>主人：太上老君<p>
        <p>首次出现章节：第六十一回  猪八戒助力破魔王　孙行者三调芭蕉扇</p>
        <p>交互方式：其他交互</p>
        <p>交互描述：将定风丹噙在口里，不觉的咽下肚里，所以五脏皆牢，皮骨皆固，凭他怎么搧，再也搧他不动。牛王慌了，把宝贝丢入口中，双手抡剑就砍。那两个在半空中这一场好杀：<p>
    `;
});

document.getElementById('magicTool18').addEventListener('click', function() {
    document.getElementById('toolInfo').innerHTML = `
        <h4>人种袋 Human seed bag </h4>
        <p>主人：黄眉老祖<p>
        <p>首次出现章节：第六十六回 诸神遭毒手　弥勒缚妖魔<p>
        <p>交互方式：动作交互 空间交互 自适应交互</p>
        <p>交互描述：这妖魔不知是个甚么搭包子，那般装得许多物件？如今将天神、天将，许多人又都装进去了。我待求救于天，奈恐玉帝见怪。<p>
    `;
});
