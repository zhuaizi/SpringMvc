/*
combined files : 

gallery/uploader/1.5/plugins/urlsInput/urlsInput

*/
/**
 * @fileoverview �洢�ļ�·����Ϣ��������
 * @author: ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/urlsInput/urlsInput',function(S, Node, Base) {
    var EMPTY = '',$ = Node.all,LOG_PREFIX = '[uploader-urlsInput]:';
    /**
     * @name UrlsInput
     * @class �洢�ļ�·����Ϣ��������
     * @constructor
     * @extends Base
     * @param {String} wrapper ��������
     * @param {Object} config ������ã�����Ĳ���Ϊ��������û�д�����ԣ���ϸ������˵���뿴���Բ��֣�
     * @param {String} config.name *�����������ƣ�����name�������򲻴���ʱ����ᴴ��һ��
     * @param {String} config.split  ���·����ķָ���
     * @param {String} config.tpl   ������ģ��
     *
     */
    function UrlsInput(config) {
        var self = this;
        //���ø��๹�캯��
        UrlsInput.superclass.constructor.call(self, config);
    }
    //�̳���Base������getter��setterί����Base����
    S.extend(UrlsInput, Base, /** @lends UrlsInput.prototype*/{
        /**
         * ��ʼ�����
         * @param {Uploader} uploader Uploader��ʵ��
         */
        pluginInitializer:function(uploader){
            var self = this;
            if(!uploader) return false;
            self.set('uploader',uploader);
            uploader.on('success',self._uploadSuccessHandler,self);

            var queue = uploader.get('queue');
            queue.on('remove',self._fileRemoveHandler,self);
        },
        /**
         * �ϴ��ɹ�����·�����������·��
         * @private
         */
        _uploadSuccessHandler:function(ev){
            var self = this;
            var result = ev.result;
            if(!S.isObject(result)) return false;
            var url = result.url;
            if(self.get('useName')) url = result.name;
            self.add(url);
            return self;
        },
        /**
         * �Ӷ�����ɾ���ļ���Ҳ���������н�·��ɾ��
         * @private
         */
        _fileRemoveHandler:function(ev){
            var self = this;
            var file = ev.file;
            var result = file.result;
            if(!result) return true;
            var url = result.url;
            if(self.get('useName')) url = result.name;
            self.remove(url);
        },
        /**
         * ��·�����������·��
         * @param {String} url ·��
         * @return {UrlsInput}
         */
        add : function(url){
            if(!S.isString(url)){
                S.log(LOG_PREFIX + 'add()��url�������Ϸ���');
                return false;
            }
            var self = this,urls = self.get('urls'),
            //�ж�·���Ƿ��Ѿ�����
                isExist = self.isExist(url);
            //TODO:��ֹ��һ��·�������Ϊ�յ����
            if(urls[0] == EMPTY) urls = [];
            if(isExist){
                S.log(LOG_PREFIX + 'add()���ļ�·���Ѿ����ڣ�');
                return self;
            }
            urls.push(url);
            self.set('urls',urls);
            self._val();
            return self;
        },
        /**
         * ɾ���������ڵ�ָ��·��
         * @param {String} url ·��
         * @return {Array} urls ɾ�����·��
         */
        remove : function(url){
            //TODO:����ļ����а����Ƿ��ַ��������޷�ƥ�䵽
            if(!url) return false;
            var self = this,urls = self.get('urls'),
                isExist = self.isExist(url) ,
                reg = new RegExp(url);
            if(!isExist){
                S.log(LOG_PREFIX + 'remove()�������ڸ��ļ�·����');
                return false;
            }
            urls = S.filter(urls,function(sUrl){
                return !reg.test(sUrl);
            });
            self.set('urls',urls);
            self._val();
            return urls;
        },
        /**
         * ������ǰinput��ֵ��ȡ���ļ�·��
         * @return {Array}
         */
        parse: function(){
            var self = this,
                input = self.get('target');
            if(input){
                var urls = $(input).val(),
                    split = self.get('split'),
                    files;
                if(urls == EMPTY) return [];
                files = urls.split(split);
                self.set('urls',files);
                return files;
            }else{
                S.log(LOG_PREFIX + 'cannot find urls input.');
                return [];
            }
        },
        /**
         * �����������ֵ
         * @return {String}
         */
        _val : function(){
            var self = this,urls = self.get('urls'),
                $input = self.get('target'),
            //���·����ķָ���
                split = self.get('split'),
                sUrl = urls.join(split);
            $input.val(sUrl);
            return sUrl;
        },
        /**
         * �Ƿ��Ѿ�����ָ��·��
         * @param {String} url ·��
         * @return {Boolean}
         */
        isExist : function(url){
            var self = this,b = false,urls = self.get('urls'),
                reg = new RegExp(url);
            if(!urls.length) return false;
            S.each(urls,function(val){
                if(reg.test(val)){
                    return b = true;
                }
            });
            return b;
        }
    }, {ATTRS : /** @lends UrlsInput.prototype*/{
        /**
         * �������
         * @type String
         * @default urlsInput
         */
        pluginId:{
            value:'urlsInput'
        },
        /**
         * �ϴ����ʵ��
         * @type Uploader
         * @default ""
         */
        uploader:{ value:EMPTY },
        /**
         * �ļ�·��
         * @type Array
         * @default []
         */
        urls : { value : [] },
        /**
         * ���·����ķָ���
         * @type String
         * @default ","
         */
        split : {value : ',',
            setter : function(v){
                var self = this;
                self._val();
                return v;
            }
        },
        /**
         * �ļ�·������input
         * @type KISSY.Node
         * @default ""
         */
        target : {value : EMPTY,
            getter:function(v){
                return $(v);
            }
        },
        /**
         * urlʹ��name
         * @type KISSY.Node
         * @default ""
         */
        useName:{value:false}
    }});

    return UrlsInput;
}, {requires:['node','base']});
/**
 * changes:
 * ���ӣ�1.5
 *          - [+]UrlsInput����useName����
 * ���ӣ�1.4
 *           - �ع���ȥ��create�����������Զ�����urlsInput
 *           - �ƶ���pluginsĿ¼�£���Ϊ�������
 *           - ȥ��target����������֧��
 *           - rich base�Ĳ����ʽ���֣�����pluginInitializer����
 *           - ����uploader��success�¼���queue��remove�¼�
 */

