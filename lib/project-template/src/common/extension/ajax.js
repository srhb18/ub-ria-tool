/**
 * ${project.alias}
 * Copyright 2014 Baidu Inc. All rights reserved.
 * 
 * @ignore
 * @file AJAX模块扩展及配置
 * @author ${developer.name}(${developer.email})
 */
define(
    function (require) {
        var u = require('underscore');
        var ajax = require('er/ajax');

        /**
         * 设置AJAX的默认配置
         *
         * @ignore
         */
        function setDefaultConfig() {
            // RIA系统的前后端接口应该有完善的缓存设置，因此默认开启GET请求的缓存
            ajax.config.cache = true;
            // 默认超时15秒，用于调试时可适当降低
            ajax.config.timeout = 15 * 1000;
            // 默认编码为utf-8
            ajax.config.charset = 'utf-8';
        }

        /**
         * 启用CSRF功能
         *
         * @ignore
         */
        function enableXSRF() {
            // 为请求带上CSRF Token
            var GlobalData = require('../GlobalData');
            var user = (new GlobalData()).getUser();
            ajax.hooks.beforeSend = function (xhr, options) {
                var method = options.method.toUpperCase();
                if (user.sessionToken && 
                    (method === 'POST' || method === 'PUT')
                ) {
                    xhr.setRequestHeader('X-Session-Token', user.sessionToken);
                }
            };
        }

        /**
         * 支持JSON格式的请求
         *
         * @ignore
         */
        function enableJSONRequest() {
            // 提供JSON格式请求的序列化功能
            var serializeAsForm = ajax.hooks.serializeData;
            // 支持JSON格式的提交
            ajax.hooks.serializeData = function (prefix, data, contentType) {
                if (!prefix && contentType === 'application/json') {
                    return JSON.stringify(data);
                }
                else {
                    return serializeAsForm.apply(ajax.hooks, arguments);
                }
            };
            // 有个`getKey`要弄回去
            ajax.hooks.serializeData.getKey = serializeAsForm.getKey;
        }

        /**
         * 处理全局AJAX错误
         *
         * @ignore
         */
        function handleGlobalError() {
            var errorCodes = {
                '403': {
                    name: 'not-authorized',
                    title: '登录超时',
                    message: '系统登录超时，请重新登录再试。',
                    handler: function () {
                        // TODO: 实现后端返回403，弹出对话框用户确认后的操作，
                        // 一般是返回首页
                        var baseURL = window.DEBUG 
                            ? '/static/index-debug.html'
                            : '/static/index.html';
                        location.href = baseURL + location.hash;
                    }
                },
                '500': {
                    name: 'server-error',
                    title: '系统错误',
                    message: '系统发生错误，请稍后再试。'
                }
            };
            ajax.on(
                'fail',
                function globalAjaxFail(error) {
                    var config = errorCodes[error.xhr.status];
                    if (config) {
                        // 避免还没登录就依赖`esui/Dialog`拉一大堆东西
                        window.require(
                            ['esui/Dialog'],
                            function (Dialog) {
                                var options = {
                                    title: config.title,
                                    content: config.message
                                };
                                var dialog = Dialog.alert(options);
                                if (config.handler) {
                                    dialog.on('ok', config.handler);
                                }
                            }
                        );
                    }
                }
            );
        }

        function enable() {
            setDefaultConfig();
            enableXSRF();
            enableJSONRequest();
            handleGlobalError();
        }

        return {
            enable: u.once(enable)
        };
    }
);