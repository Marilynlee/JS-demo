/**
 * Created by Marilyn on 2016/10/26.
 */

/*
* namespace LYN命名空间
* */
var LYN={};

/*
 * 接口类 Interface Class ==》实例化多个接口,需2个参数
 * @parameter：接口的名字
 * @parameter：接收方法名称的集合（数组）
 * */
LYN.Interface = function (name, methods) {
//  判断接口的参数个数
    if (arguments.length != 2) {
        throw new Error('The instance interface constructor need 2 arguments!');
    }
    this.name = name;
//  定义一个空的内置对象，接收参数methods里面的元素（方法的名字）
    this.methods = [];
    for (var i = 0, len = methods.length; i < len; i++) {
        if (typeof methods[i] !== 'string') {
            throw new Error('Instance interface\'s name must be string!');
        } else {
            this.methods.push(methods[i]);
        }
    }
};

/*
 * Interface static method 检验接口里的方法
 * @param {object} object
 * */
//    如果检验通过无操作，如果不通过则抛出Error。Interface.checkImpl目的检测方法是否实现
LYN.Interface.checkImpl = function (object) {
//        如果检测方法接收的参数不足2个，则参数传递失败
    if (arguments.length < 2) {
        throw new Error('Object does not implement required interface!');
    }
//        获得接口实例对象以拿到实例对象的方法
    for (var i = 1, len = arguments.length; i < len; i++) {
        var interfaceName = arguments[i];
//            判断参数是否是接口类的类型
        if (interfaceName.constructor !== LYN.Interface) {
            throw new Error('The arguments constructor is not Interface class!');
        }
//            循环接口实例对象里面的每一个方法
        for (var j = 0, l = interfaceName.methods.length; j < l; j++) {
//                用一个临时变量methodName接收每一个方法的名字（类型是string）
            var methodName = interfaceName.methods[j];
//                object[key]就是方法
            if (!object[methodName] || typeof object[methodName] !== 'function') {
                throw new Error("The '" + methodName + "' method is not found!");
            }
        }

    }

};

/*
* EXTEND method 继承方法
* @param {object} sub
* @param {object} sup
* */
LYN.extend=function(sub, sup) {
    // 目的： 实现只继承父类的原型对象
    var F = new Function();	// 1 创建一个空函数    目的：空函数进行中转
    F.prototype = sup.prototype; // 2 实现空函数的原型对象和超类的原型对象转换
    sub.prototype = new F(); 	// 3 原型继承
    sub.prototype.constructor = sub; // 4还原子类的构造器
    //保存一下父类的原型对象: 一方面方便解耦  另一方面方便获得父类的原型对象
    sub.superClass = sup.prototype; //自定义一个子类的静态属性 接受父类的原型对象
    //判断父类的原型对象的构造器 (加保险)
    if (sup.prototype.constructor == Object.prototype.constructor) {
        sup.prototype.constructor = sup; //手动欢迎父类原型对象的构造器
    }
};

/*
* 单体模式：实现一个浏览器的事件处理模式
*
* */
LYN.EventUtil={
    addHandler:function(element , type , handler){
        if(element.addEventListener){		//FF
            element.addEventListener(type,handler,false);
        } else if(element.attachEvent){		//IE
            element.attachEvent('on'+type , handler);
        }
    } ,
    removeHandler:function(element , type , handler){
        if(element.removeEventListener){		//FF
            element.removeEventListener(type,handler,false);
        } else if(element.detachEvent){		//IE
            element.detachEvent('on'+type , handler);
        }
    }
};

/**
 * 扩展Array的原型对象 添加变量数组的每一个元素,并让每一个元素都执行fn函数 (可遍历多维数组)
 * @param {Object} fn
 */
Array.prototype.each = function(fn){
    try{
        //1 目的： 遍历数组的每一项 //计数器 记录当前遍历的元素位置
        this.i || (this.i=0);  //var i = 0 ;
        //2 严谨的判断什么时候去走each核心方法
        // 当数组的长度大于0的时候 && 传递的参数必须为函数
        if(this.length >0 && fn.constructor == Function){
            // 循环遍历数组的每一项
            while(this.i < this.length){	//while循环的范围
                //获取数组的每一项
                var e = this[this.i];
                //如果当前元素获取到了 并且当前元素是一个数组
                if(e && e.constructor == Array){
                    // 直接做递归操作
                    e.each(fn);
                } else {
                    //如果不是数组 （那就是一个单个元素）
                    // 这的目的就是为了把数组的当前元素传递给fn函数 并让函数执行
                    //fn.apply(e,[e]);
                    fn.call(e,e);
                }
                this.i++ ;
            }
            this.i = null ; // 释放内存 垃圾回收机制回收变量
        }

    } catch(ex){
        // do something
    }
    return this ;
};

