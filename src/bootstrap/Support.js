/**
 * Created with JetBrains PhpStorm.
 * User: kev
 * Date: 7/25/12
 * Time: 8:18 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    "dojo/query",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/_base/array",
    "dojo/_base/json",
    "dojo/NodeList-data"
],
function (query, lang, attr, array, json) {
    "use strict";

    var _transition = (function () {
        var transitionEnd = (function () {
            var el = document.createElement('bootstrap');
            var transEndEventNames = {
                'WebkitTransition':'webkitTransitionEnd',
                'MozTransition':'transitionend',
                'OTransition':'oTransitionEnd',
                'msTransition':'MSTransitionEnd',
                'transition':'transitionend'
            };
            for (var name in transEndEventNames) {
                if (el.style[name] !== undefined) {
                    return transEndEventNames[name];
                }
            }
        })();
        return transitionEnd && {
            end:transitionEnd
        };
    })();

    var _loadData = function(node){
        //load data attributes
        var elm = query(node)[0];
        if(elm){
            var _this = this;
            var attrs = elm.attributes;
            array.forEach(attrs, function(attr){
                if(attr.name.indexOf("data-") >= 0){
                    _this.setData(node, attr.name.substr(5), _attrValue(attr.value));
                }
            });
        }
    };

    var _attrValue = function(val){
        if (!val) { return; }
        if (val.indexOf('{') === 0 && val.indexOf('}') === val.length-1) {
            return json.fromJson(val);
        } else if (val.indexOf('[') === 0 && val.indexOf(']') === val.length-1) {
            return json.fromJson(val);
        } else {
            return val;
        }
    };

    return {
        trans: _transition,
        getData: function(node, key, def){
            key = key || undefined;
            def = def || undefined;
            if(key !== undefined && lang.isString(key)){
                var data = query(node).data(key);
                if (data && data[0] === undefined) {
                    data = attr.get(node, 'data-'+key);
                    if (data !== undefined){ data = _attrValue(data); }
                    if (data === undefined && def !== undefined){
                        data = this.setData(node, key, def);
                    }
                }
                return (lang.isArray(data) && data.length > 0) ? data[0] : data;
            } else {
                _loadData.call(this, node);
                return query(node).data()[0];
            }
        },
        setData: function(node, key, value){
            var data = query(node).data(key, value);
            return value;
        },
        toCamel: function(str){
            return str.replace(/(\-[a-z])/g, function($1){ return $1.toUpperCase().replace('-',''); });
        },
        toDash: function(str){
            return str.replace(/([A-Z])/g, function($1){ return "-"+$1.toLowerCase(); });
        },
        toUnderscore: function(str){
            return str.replace(/([A-Z])/g, function($1){ return "_"+$1.toLowerCase(); });
        }
    };
});