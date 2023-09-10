// ==UserScript==
// @name         GoogleMore
// @namespace    https://greasyfork.org/zh-CN/scripts/469906-googlemore
// @version      1.2.1
// @description  谷歌搜索快速跳转搜索其他网站
// @author       marumaru
// @license MIT
// @match        https://www.google.com/search?q*
// @match        https://www.google.com.hk/search?q*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==


(function () {
    'use strict';

    setTimeout(() => {


        //重置导航条宽度
        var navigation = document.querySelector('[role="navigation"]');
        navigation.style.width = 'calc(var(--center-width) + var(--rhs-margin) + var(--rhs-width) + -170px)';



        // 导航条第一个元素
        const bar = document.querySelector('[data-st-cnt="mode"]')
        let imageElement = bar.querySelectorAll("a")[0];


        //var imageElement = Array.from(document.getElementsByTagName('*')).find(el => el.innerText === '图片');
        console.log('imageElement: ', imageElement);




        var targetElement;

        var elements = document.querySelectorAll('.GKS7s').length > 0 ? document.querySelectorAll('.GKS7s') : document.querySelectorAll('.O3S9Rb');

        targetElement = elements[0]
        var parentElement = targetElement.parentNode.parentNode;




        var keyword = ''
        const defaultConfig = [
            { name: '百度', url: 'https://www.baidu.com/s?wd=' },
            { name: '豆瓣', url: 'https://www.douban.com/search?source=suggest&q=' },
            { name: '知乎', url: 'https://www.zhihu.com/search?type=content&q=' },
            { name: '必应', url: 'https://www.bing.com/search?cc=sg&q=' },
            { name: 'V2EX', url: 'https://www.google.com/search?q=site:v2ex.com/t%20' },
            { name: '哔哩哔哩', url: 'https://search.bilibili.com/all?keyword=' },
            { name: 'YouTube', url: 'https://www.youtube.com/results?search_query=' },
            { name: '淘宝', url: 'https://s.taobao.com/search?commend=all&ie=utf8&initiative_id=tbindexz_20170306&q=' },




        ];
        // 获取用户自定义的 data 数组，如果没有则使用默认的数组
        const customCofig = GM_getValue('data') || defaultConfig
        var data = customCofig



        function createLinkElement(item, elementType = 'a') {
            var copiedElement = imageElement.cloneNode(true);
            let aElement;

            // 检查copiedElement本身是否为 "a" 标签
            if (copiedElement.tagName.toLowerCase() === "a") {
                aElement = copiedElement;
            } else {
                aElement = copiedElement.querySelector("a");
            }

            // 修改a标签的URL

            aElement.href = item.url;
            aElement.target = '_blank';
            if (item.url === 'edit') {

                aElement.href = "javascript:void(0)";

            }
            function getDeepestChild(element) {
                // 如果元素没有子元素，就返回元素本身
                if (element.children.length === 0) {
                    return element;
                }
                // 否则，递归调用getDeepestChild函数，获取第一个子元素的最深层次的子元素
                return getDeepestChild(element.children[0]);
            }
            const deepChild = getDeepestChild(copiedElement)
            deepChild.innerText = item.name;
            return copiedElement;
        }



        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            const newElement = createLinkElement(item)
            newElement.addEventListener('mouseenter', function (event) {
                var inputElement = document.querySelector('#APjFqb');
                keyword = encodeURIComponent(inputElement.value)

                // 修改链接的href属性，使其包含输入框中的关键词

                var url = event.target.href;
                var lastEqualSign = url.lastIndexOf('=');
                var result

                if (url.includes('q=site:v2ex')) {

                    result = 'https://www.google.com/search?q=site:v2ex.com/t%20'
                } else {
                    result = url.substring(0, lastEqualSign + 1); // +1 是为了保留等号
                }
                //console.log(result)
                event.target.href = result + keyword
            });

            parentElement.insertBefore(newElement, targetElement.parentNode);
        }



        //*****编辑功能*******
        // 添加一个编辑按钮
        const editButton = createLinkElement({ url: 'edit', name: '编辑' }, 'button')
        parentElement.append(editButton)

        //对话框样式
        const styles = {
            dialog: "z-index:100;display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 1px solid black; padding: 20px; background-color: white; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);",
            button: "margin-right: 10px;  background-color: white; border: 1px soid black; border-radius: 5px; cursor: pointer; transition: background-color 0.2s;",
            input: "margin-right: 10px;",

            configContainer: "margin-bottom: 10px;"
        };



        // 创建dialog div
        let dialog = document.createElement("div");
        dialog.id = "dialog";
        dialog.style.cssText = styles.dialog;
        document.body.appendChild(dialog);


        // 创建关闭button
        let closeButton = document.createElement("button");
        closeButton.innerText = "保存";
        closeButton.style.cssText = styles.button;
        closeButton.addEventListener('click', function () {
            dialog.style.display = 'none'; // 隐藏对话框
            GM_setValue('data', customCofig);
            location.reload();

        });

        // 创建"还原"按钮
        let restoreButton = document.createElement("button");
        restoreButton.style.cssText = styles.button;
        restoreButton.innerText = "还原";
        // 添加"还原"按钮点击事件
        restoreButton.addEventListener('click', function () {
            dialog.style.display = 'none'; // 隐藏对话框
            GM_setValue('data', defaultConfig);
            location.reload();

        });
        const btnBox = document.createElement('div')
        btnBox.style.marginBottom = '10px'
        btnBox.appendChild(closeButton);

        btnBox.appendChild(restoreButton);

        // 创建"新增"按钮
        let addButton = document.createElement("button");
        addButton.innerText = "新增";
        addButton.style.cssText = styles.button;
        btnBox.appendChild(addButton);
        // 添加"新增"按钮点击事件
        addButton.addEventListener('click', function () {
            let configContainer = document.createElement("div");
            configContainer.style.cssText = styles.configContainer;

            let nameInput = document.createElement("input");
            nameInput.style.cssText = styles.input;
            configContainer.appendChild(nameInput);

            let urlInput = document.createElement("input");
            urlInput.style.cssText = styles.input;
            configContainer.appendChild(urlInput);

            let updateButton = document.createElement("button");
            updateButton.innerText = "保存";
            updateButton.style.cssText = styles.button;
            updateButton.addEventListener('click', function () {
                // 将新的配置项添加到customCofig中
                customCofig.push({ name: nameInput.value, url: urlInput.value });
                dialog.style.display = 'none'; // 隐藏对话框
                editButton.click(); // 重新打开对话框以刷新内容
            });
            configContainer.appendChild(updateButton);

            dialog.appendChild(configContainer);
        });

        dialog.appendChild(btnBox);

        // 添加点击事件
        editButton.addEventListener('click', function () {
            dialog.style.display = 'block'; // 显示对话框

            // 清空对话框，但保留关闭按钮
            while (dialog.children.length > 1) {
                dialog.removeChild(dialog.lastChild);
            }

            // 根据customCofig生成编辑区域
            customCofig.forEach((config, index) => {
                let configContainer = document.createElement("div");
                configContainer.style.cssText = styles.configContainer;

                let nameInput = document.createElement("input");
                nameInput.value = config.name;
                nameInput.style.cssText = styles.input;
                configContainer.appendChild(nameInput);

                let urlInput = document.createElement("input");
                urlInput.value = config.url;
                urlInput.style.cssText = styles.input;
                configContainer.appendChild(urlInput);

                let updateButton = document.createElement("button");
                updateButton.innerText = "更新";
                updateButton.style.cssText = styles.button;
                updateButton.addEventListener('click', function () {
                    config.name = nameInput.value;
                    config.url = urlInput.value;
                });
                configContainer.appendChild(updateButton);

                let deleteButton = document.createElement("button");
                deleteButton.innerText = "删除";
                deleteButton.style.cssText = styles.button;
                deleteButton.addEventListener('click', function () {
                    customCofig.splice(index, 1);
                    dialog.style.display = 'none'; // 隐藏对话框
                    editButton.click(); // 重新打开对话框以刷新内容
                });
                configContainer.appendChild(deleteButton);

                dialog.appendChild(configContainer);
            });
        });

    }, 200)



})();
