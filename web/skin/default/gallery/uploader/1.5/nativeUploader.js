/*
combined files : 

gallery/uploader/1.5/queue
gallery/uploader/1.5/nativeUploader

*/
/**
 * @fileoverview �ļ��ϴ������б���ʾ�ʹ���
 * @author ��ƽ�����ӣ�<minghe36@126.com>,��Ӣ<daxingplay@gmail.com>
 **/
KISSY.add('gallery/uploader/1.5/queue',function (S, Node, Base) {
    var EMPTY = '', $ = Node.all, LOG_PREFIX = '[uploader-queue]:';

    /**
     * ת���ļ���С�ֽ���
     * @param {Number} bytes �ļ���С�ֽ���
     * @return {String} �ļ���С
     */
    function convertByteSize(bytes) {
        var i = -1;
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes > 99);
        return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
    }

    /**
     * @name Queue
     * @class �ļ��ϴ����У����ڴ洢�ļ�����
     * @constructor
     * @extends Base
     * @param {Object} config Queueû�б�д������
     * @param {Uploader} config.uploader Uploader��ʵ��
     * @example
     * S.use('gallery/uploader/1.5/queue/base,gallery/uploader/1.5/themes/default/style.css', function (S, Queue) {
     *    var queue = new Queue();
     *    queue.render();
     * })
     */
    function Queue(config) {
        var self = this;
        //���ø��๹�캯��
        Queue.superclass.constructor.call(self, config);
    }

    S.mix(Queue, /**@lends Queue*/ {
        /**
         * ֧�ֵ��¼�
         */
        event:{
            //������ļ��󴥷�
            ADD:'add',
            //��������ļ��󴥷�
            ADD_FILES:'addFiles',
            //ɾ���ļ��󴥷�
            REMOVE:'remove',
            //����������е��ļ��󴥷�
            CLEAR:'clear',
            //���ı��ļ�״̬�󴥷�
            FILE_STATUS : 'statusChange',
            //�����ļ����ݺ󴥷�
            UPDATE_FILE : 'updateFile'
        },
        /**
         * �ļ���״̬
         */
        status:{
            WAITING : 'waiting',
            START : 'start',
            PROGRESS : 'progress',
            SUCCESS : 'success',
            CANCEL : 'cancel',
            ERROR : 'error',
            RESTORE: 'restore'
        },
        //�ļ�Ψһidǰ׺
        FILE_ID_PREFIX:'file-'
    });
    /**
     * @name Queue#add
     * @desc  ������ļ��󴥷�
     * @event
     * @param {Number} ev.index �ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     */
    /**
     * @name Queue#addFiles
     * @desc  ��������ļ��󴥷�
     * @event
     * @param {Array} ev.files ��Ӻ���ļ����ݼ���
     */
    /**
     * @name Queue#remove
     * @desc  ɾ���ļ��󴥷�
     * @event
     * @param {Number} ev.index �ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     */
    /**
     * @name Queue#clear
     * @desc  ����������е��ļ��󴥷�
     * @event
     */
    /**
     * @name Queue#statusChange
     * @desc  ���ı��ļ�״̬�󴥷�
     * @event
     * @param {Number} ev.index �ļ��ڶ����е�����ֵ
     * @param {String} ev.status �ļ�״̬
     */
    /**
     * @name Queue#updateFile
     * @desc  �����ļ����ݺ󴥷�
     * @event
     * @param {Number} ev.index �ļ��ڶ����е�����ֵ
     * @param {Object} ev.file �ļ�����
     */
    //�̳���Base������getter��setterί����Base����
    S.extend(Queue, Base, /** @lends Queue.prototype*/{
        /**
         * ���ϴ���������ļ�
         * @param {Object | Array} files �ļ����ݣ���������ʱΪ�������
         * @example
         * //�����ļ�����
 var testFile = {'name':'test.jpg',
     'size':2000,
     'input':{},
     'file':{'name':'test.jpg', 'type':'image/jpeg', 'size':2000}
 };
 //���������ļ�
 queue.add(testFile);
         */
        add:function (files, callback) {
            var self = this,fileData={};
            //������ڶ���ļ�����Ҫ��������ļ�
            if (files.length > 0) {
                fileData=[];
                var uploader =self.get('uploader');
                var len = self.get('files').length;
                var hasMax = uploader.get('max') > 0;
                S.each(files,function(file, index){
                    if(!hasMax){
                        fileData.push(self._addFile(file));
                    }else{
                        //�����Ƿ񳬹��ж�
                        //#128 https://github.com/kissyteam/kissy-gallery/issues/128 by ����
                        var max = uploader.get('max');
                        if (max >= len + index + 1) {
                            fileData.push(self._addFile(file));
                        }
                    }
                });
            } else {
                fileData = self._addFile(files);
            }
            callback && callback.call(self);
            return fileData;
        },
        /**
         * �������ӵ����ļ�
         * @param {Object} file �ļ�����
         * @param {Function} callback �����ɺ�ִ�еĻص�����
         * @return {Object} �ļ����ݶ���
         */
        _addFile:function (file,callback) {
            if (!S.isObject(file)) {
                S.log(LOG_PREFIX + '_addFile()����file���Ϸ���');
                return false;
            }
            var self = this,
                //�����ļ�����
                fileData = self._setAddFileData(file),
                //�ļ�����
                index = self.getFileIndex(fileData.id),
                fnAdd = self.get('fnAdd');
            //ִ���û��Զ���Ļص�����
            if(S.isFunction(fnAdd)){
                fileData = fnAdd(index,fileData);
            }
            self.fire(Queue.event.ADD, {index:index, file:fileData,uploader:self.get('uploader')});
            callback && callback.call(self, index, fileData);
            return fileData;
        },
        /**
         * ɾ��������ָ��id���ļ�
         * @param {Number} indexOrFileId �ļ������������ļ�id
         * @param {Function} callback ɾ��Ԫ�غ�ִ�еĻص�����
         * @example
         * queue.remove(0);
         */
        remove:function (indexOrFileId, callback) {
            var self = this, files = self.get('files'), file;
            //�������ַ�����˵�����ļ�id���Ȼ�ȡ��Ӧ�ļ����������
            if (S.isString(indexOrFileId)) {
                indexOrFileId = self.getFileIndex(indexOrFileId);
            }
            //�ļ����ݶ���
            file = files[indexOrFileId];
            if (!S.isObject(file)) {
                S.log(LOG_PREFIX + 'remove()������indexΪ' + indexOrFileId + '���ļ�����');
                return false;
            }
            //����id���ļ����˵�
            files = S.filter(files, function (file, i) {
                return i !== indexOrFileId;
            });
            self.set('files', files);
            self.fire(Queue.event.REMOVE, {index:indexOrFileId, file:file});
            callback && callback.call(self,indexOrFileId, file);
            return file;
        },
        /**
         * �������
         */
        clear:function () {
            var self = this, files;
            _remove();
            //�Ƴ�Ԫ��
            function _remove() {
                files = self.get('files');
                if (!files.length) {
                    self.fire(Queue.event.CLEAR);
                    return false;
                }
                self.remove(0, function () {
                    _remove();
                });
            }
        },
        /**
         * ��ȡ�������ļ�״̬��Ĭ�ϵ����⹲�������ļ�״̬��'waiting'��'start'��'progress'��'success'��'cancel'��'error' ,ÿ��״̬��dom�������ͬ��ˢ���ļ�״̬ʱ��ͬʱˢ��״̬�������µ�DOM�ڵ����ݡ�
         * @param {Number} index �ļ����������ֵ
         * @param {String} status �ļ�״̬
         * @return {Object}
         * @example
         * queue.fileStatus(0, 'success');
         */
        fileStatus:function (index, status, args) {
            if (!S.isNumber(index)) return false;
            var self = this, file = self.getFile(index),
                theme = self.get('theme'),
                curStatus,statusMethod;
            if (!file) return false;
            //״̬
            curStatus = file['status'];
            if(!status){
                return curStatus;
            }
            //״̬һֱֱ�ӷ���
            if(curStatus == status) return self;
            //����״̬
            self.updateFile(index,{status:status});
            self.fire(Queue.event.FILE_STATUS,{index : index,status : status,args:args,file:file});
            return  self;
        },
        /**
         * ��ȡָ������ֵ�Ķ����е��ļ�
         * @param  {Number} indexOrId �ļ��ڶ����е�������id
         * @return {Object}
         */
        getFile:function (indexOrId) {
            var self = this;
            var file;
            var files = self.get('files');
            if(S.isNumber(indexOrId)){
                file = files[indexOrId];
            }else{
                S.each(files, function (f) {
                    if (f.id == indexOrId) {
                        file = f;
                        return true;
                    }
                });
            }
            return file;
        },
        /**
         * �����ļ�id�������ļ��ڶ����е�����
         * @param {String} fileId �ļ�id
         * @return {Number} index
         */
        getFileIndex:function (fileId) {
            var self = this, files = self.get('files'), index = -1;
            S.each(files, function (file, i) {
                if (file.id == fileId) {
                    index = i;
                    return true;
                }
            });
            return index;
        },
        /**
         * �����ļ����ݶ��������׷������
         * @param {Number} index �ļ������ڵ�����ֵ
         * @param {Object} data ����
         * @return {Object}
         */
        updateFile:function (index, data) {
            if (!S.isNumber(index)) return false;
            if (!S.isObject(data)) {
                S.log(LOG_PREFIX + 'updateFile()��data��������');
                return false;
            }
            var self = this, files = self.get('files'),
                file = self.getFile(index);
            if (!file) return false;
            S.mix(file, data);
            files[index] = file;
            self.set('files', files);
            self.fire(Queue.event.UPDATE_FILE,{index : index, file : file});
            return file;
        },
        /**
         * ��ȡ��ָ��״̬���ļ���Ӧ���ļ�����index������
         * @param {String} type ״̬����
         * @return {Array}
         * @example
         * //getFiles()��getFileIds()�������ǲ�ͬ�ģ�getFiles()���ƹ������飬��ȡ����ָ��״̬���ļ����ݣ���getFileIds()ֻ�ǻ�ȡָ��״̬�µ��ļ���Ӧ�����ļ������ڵ�����ֵ��
         * var indexs = queue.getFileIds('waiting');
         */
        getIndexs:function (type) {
            var self = this, files = self.get('files'),
                status, indexs = [];
            if (!files.length) return indexs;
            S.each(files, function (file, index) {
                if (S.isObject(file)) {
                    status = file.status;
                    //�ļ�״̬
                    if (status == type) {
                        indexs.push(index);
                    }
                }
            });
            return indexs;
        },
        /**
         * ��ȡָ��״̬�µ��ļ�
         * @param {String} status ״̬����
         * @return {Array}
         * @example
         * //��ȡ�ȴ��е������ļ�
         * var files = queue.getFiles('waiting');
         */
        getFiles:function (status) {
            var self = this, files = self.get('files'), statusFiles = [];
            if (!files.length) return [];
            S.each(files, function (file) {
                if (file && file.status == status) statusFiles.push(file);
            });
            return statusFiles;
        },
        /**
         * ����ļ�ʱ�����ļ����ݶ���׷��id��size������
         * @param {Object} file �ļ����ݶ���
         * @return {Object} �µ��ļ����ݶ���
         */
        _setAddFileData:function (file) {
            var self = this,
                files = self.get('files');
            if (!S.isObject(file)) {
                S.log(LOG_PREFIX + '_updateFileData()����file���Ϸ���');
                return false;
            }
            //�����ļ�Ψһid
            if (!file.id) file.id = S.guid(Queue.FILE_ID_PREFIX);
            //ת���ļ���С��λΪ��kb��mb��
            if (file.size) file.textSize = convertByteSize(file.size);
            //״̬
            if(!file.status) file.status = 'waiting';
            files.push(file);
            return file;
        }
    }, {ATTRS:/** @lends Queue.prototype*/{
        /**
         * ������ļ����ݺ�ִ�еĻص�����������add�¼�ǰ����
         * @type Function
         * @default  ''
         */
        fnAdd:{value:EMPTY},
        /**
         * �����������ļ����ݼ���
         * @type Array
         * @default []
         * @example
         * var ids = [],
         files = queue.get('files');
         S.each(files, function (file) {
         ids.push(file.id);
         });
         alert('�����ļ�id��' + ids);
         */
        files:{value:[]},
        /**
         * �ö��ж�Ӧ��Uploaderʵ��
         * @type Uploader
         * @default ""
         */
        uploader:{value:EMPTY}
    }});

    return Queue;
}, {requires:['node', 'base']});
/**
 * changes:
 * ���ӣ�1.5
 *      - [!] #72 getFile()�����Ż�
 * ���ӣ�1.4
 *           - ȥ����Theme�����
 *           - ȥ��restore
 */
/**
 * @fileoverview �����ͻ���ʹ�ã�����native���ϴ����ʵ��ͼƬ�ϴ�����
 * @author jianping.xwh<jianping.xwh@taobao.com>
 * @module native-uploader
 * @�ο��� http://confluence.taobao.ali.com/pages/viewpage.action?pageId=200209347
 * ��л����ͬѧ��æ�����˼�������bug
 **/
KISSY.add('gallery/uploader/1.5/nativeUploader',function (S, Node,JSON,Base,Queue) {
    var EMPTY = '';
    var $ = Node.all;
    var status = {
        WAITING:'waiting',
        START:'start',
        PROGRESS:'progress',
        SUCCESS:'success',
        CANCEL:'cancel',
        ERROR:'error'
    };
    var event = {
        //ѡ�����ļ��󴥷�
        SELECT:'select',
        //��������һ���ļ��󴥷�
        ADD:'add',
        //��ʼ�ϴ��󴥷�
        START:'start',
        //�����ϴ���ʱ����
        PROGRESS:'progress',
        //�ϴ���ɣ����ϴ��ɹ����ϴ�ʧ�ܺ󶼻ᴥ����
        COMPLETE:'complete',
        //�ϴ��ɹ��󴥷�
        SUCCESS:'success',
        //�����ϴ������󴥷�
        UPLOAD_FILES:'uploadFiles',
        //ȡ���ϴ��󴥷�
        CANCEL:'cancel',
        //�ϴ�ʧ�ܺ󴥷�
        ERROR:'error',
        //�Ƴ������е�һ���ļ��󴥷�
        REMOVE:'remove'
    };

    var queryInterval = null;// ��֤һ�ν���ֻ��һ����ѯ��1����֤���ܣ�2����֤�����߼���  ���޲T��ͨ���Ľ��
    //��ӡ��־
    function Log(content, clear){
        var log = $('#Log');
        if( clear === true ){
            log.html('');
        }
        if( log.length == 0 ){
            return ;
        }
        if( typeof content != 'string' ){
            content = JSON.stringify(content);
        }

        log.html( log.html() + '<br>' + content)
    }

    return Base.extend({
        initializer:function(){
            var self = this;
            var $srcNode = self.get('target');
            if(!$srcNode.length){
                S.log('srcNode�ڵ㲻����');
                return false;
            }
            self._renderQueue();
            $srcNode.on('click',function(){
                if (window.navigator.userAgent.match(/WindVane/i)) {
                    self.select();
                }else{
                    alert('�ǳ���Ǹ���ϴ�����ֻ�����Ա��ͻ�����ʹ��T_T');
                }
            })
        },
        /**
         * ����Queue�������
         * @return {Queue} ����ʵ��
         */
        _renderQueue:function () {
            var self = this, queue = new Queue();
            //���ϴ����ʵ���������У���������ڲ�ִ��ȡ���������ϴ��Ĳ���
            queue.set('uploader', self);
            queue.on('add',function(ev){
                self.fire(event.ADD,ev);
            });
            //�������е�ɾ���¼�
            queue.on('remove', function (ev) {
                var prevPaths = self.get('prevPaths');

                var deleteFileSrc = [prevPaths[ev.index]];
                self._deleteOneFile(deleteFileSrc);

                prevPaths.splice(ev.index, 1);
                self.set('prevPaths', prevPaths);
                self.fire(event.REMOVE,ev);
            });
            self.set('queue', queue);
            return queue;
        },

        _deleteOneFile: function(src){
            WindVane.call('MultiPhotoPicker', 'delete', src, function(){}, function(){});
        },

        /**
         * ʹ��ָ������
         * @param {Theme} oTheme ������
         * @return  {Uploader|Boolean}
         */
        theme:function (oTheme) {
            var self = this;
            var theme = self.get('theme');
            if(!oTheme)return false;
            if (theme) {
                S.log('��֧��������Ⱦ���⣡');
                return self;
            }
            oTheme.set('uploader',self);
            oTheme.set('queue',self.get('queue'));
            oTheme.render && oTheme.render();
            self.fire('themeRender', {theme:theme, uploader:self});
            self.set('theme', oTheme);
            return self;
        },
        //���������ļ�
        _addFile:function(path){
            var self = this;
            var queue = self.get('queue');
            var file = {
                'name':path,
                'file':{'name':path, 'type':'image/jpeg'}
            };
            queue.add(file);
            return self;
        },
        //�ϴ���ʱ�Ĵ���
        //percentageΪ�ٷֱ�
        //nameΪ�ļ�·��
        _progress:function(percentage,name){
            if(percentage <= 1) return false;
            var self = this;
            var queue = self.get('queue');
            var file = self._getFile(name);
            var index = queue.getFileIndex(file.id);
            var ev = {file:file,index:index,percentage:percentage};
            queue.fileStatus(index, status.PROGRESS, ev);
            self.fire(event.PROGRESS, ev);
            return self;
        },
        //�ϴ��ɹ���
        //���������ص�·��
        _success:function(url,name){
            var self = this;
            var queue = self.get('queue');
            var file = self._getFile(name);
            var index = queue.getFileIndex(file.id);
            var uris = url.split('/');
            var name = uris[uris.length - 1];
            var ev = {file:file,index:index,result:{url:url,name:name}};
            file.result = ev.result;
            queue.fileStatus(index, status.SUCCESS, ev);
            self.fire(event.SUCCESS, ev);
            return self;
        },
        //�ϴ�ʧ�ܺ�
        _error:function(msg,name){
            var self = this;
            var queue = self.get('queue');
            var file = self._getFile(name);
            var index = queue.getFileIndex(file.id);
            var ev = {file:file,index:index,msg:msg};
            queue.fileStatus(index, status.ERROR, ev);
            self.fire(event.ERROR, ev);
            return self;
        },
        //ͨ��name��ȡfile
        _getFile:function(name){
            var self = this;
            var queue = self.get('queue');
            var files = queue.get('files');
            var newFiles = S.filter(files,function(file){
                return file.name == name;
            });
            return newFiles[0];
        },
        //ѡ����Ƭ
        select:function(){
            var self = this;
            var queryInterval;
            var prevPaths = self.get('prevPaths');
            var tparm = {
                "path": prevPaths
            };
            var cparam = prevPaths ? tparm : '';
            self.fire('select');
            WindVane.call('MultiPhotoPicker','pick',cparam,function(result){
                //result demo : {"path":["path1","path2"]}
                var paths = result.path;
                S.log(paths);
                if( !S.isArray(paths) ){
                    paths = [paths];
                }
                // Log(paths);
                //��·������
                paths = S.filter(paths,function(item){
                    return decodeURIComponent(item);
                });
                S.each(paths,function(p,i){
                    if(prevPaths && prevPaths.indexOf(p) > -1){
                        return true;
                    }
                    self._addFile(p);
                })
                self.set('prevPaths',paths);
                //��ѯ�ϴ�״̬
                queryInterval && clearInterval(queryInterval);
                queryInterval = setInterval(function(){
                    self.updateStatus(paths, function(){
                        queryInterval && clearInterval(queryInterval);
                        queryInterval = null;
                    });
                },500);

                // ����
                setTimeout(function(){
                    if( queryInterval ){
                        // alert(queryInterval)
                        queryInterval && clearInterval(queryInterval);
                        queryInterval = null;
                    }
                }, 10000);
            },function(){});
        },
        //������Ƭ״̬
        //paths demo: {"path":["path1","path2"]}
        //queryInterval ��ѯ��ʱ��
        updateStatus:function(paths,queryIntervalHandler){
            var self = this;
            if(!S.isArray(paths) || !paths.length) return false;
            //��·���������ݸ�native
            var tparm = {};
            tparm['path'] = paths;
            var cparam = paths ? tparm : '';
            WindVane.call('MultiPhotoPicker','status_query',cparam,function(result){
                // Log(' ', true);
                // Log('===');
                // Log(result);
                // Log('===');
                var $path;
                //demo :  {"path1":{"status":"1","remote":{"key":"value"},"percentage":"23"},"path2":{xxxx}}
                /*status= -1:ʧ�� 1:�ϴ���   2:�ɹ�
                 remote���ϴ��ɹ���mtop�ӿڷ��ص�data�ֶ�
                 percentage:�ϴ��ٷֱ�
                 */
                // $('#J_Urls2').html('').css('background', '#' + parseInt(Math.random() * 1000000));
                //�Ƿ�ն���
                var queue_len = 0;
                S.each(result,function(p,k){
                    ++queue_len;
                    if(p.status == 2 || p.status == 0){
                        // Log('uploader success:');
                        // Log(p);
                        p.remote.resourceUri && self._success(p.remote.resourceUri,k);
                        // $('#J_Urls2').html( $('#J_Urls2').html() + '<img src="'+ p.remote.resourceUri + '" width="100" height="100" data-path="' + k + '">');
                        --queue_len;
                    }
                    else if(p.status == 1){
                        self._progress(p.percentage,k);
                    }
                    else if(p.status == -1){
                        self._error('�ϴ�ʧ����,��ɾ�������԰�',k);
                        --queue_len;
                        self._deleteOneFile(k); //
                    }
                    else{
                        // ����������
                        self._error('�ϴ�ʧ����,��ɾ�������԰�',k);
                        --queue_len;
                        self._deleteOneFile(k); //
                    }
                });

                //�ն���
                if( queue_len == 0 ){
                    queryIntervalHandler && queryIntervalHandler();
                }

            },function(result){
                queryIntervalHandler && queryIntervalHandler();
            });
        }
    },{
        ATTRS:{
            target:{
                value:EMPTY,
                getter:function(v){
                    return $(v);
                }
            },
            upNode:{value:'.J_UploaderUp'},
            successPaths:{value:[]},
            prevPaths:{value:[]},
            //����ʵ��
            theme:{ value:EMPTY },
            //����ʵ��
            queue:{value:EMPTY}
        }
    });
}, {requires:['node','json','base','./queue']});



