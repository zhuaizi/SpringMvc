/*
combined files : 

gallery/uploader/1.5/token
gallery/uploader/1.5/plugins/miniLogin/miniLogin

*/
/**
 * _��ȡtoken?
 */
KISSY.add('gallery/uploader/1.5/token',function (S ,io) {
    var DAILY_TOKEN_API = 'http://aop.widgets.daily.taobao.net/block/getReqParam.htm';
    var LINE_TOKEN_API = 'http://aop.widgets.taobao.com/block/getReqParam.htm';
    /**
     * $��ȡdomain
     * @return {String}
     */
    function getDomain(){
        var host = arguments[1] || location.hostname;
        var da = host.split('.'), len = da.length;
        var deep = arguments[0]|| (len<3?0:1);
        if (deep>=len || len-deep<2)
            deep = len-2;
        return da.slice(deep).join('.');
    }

    /**
     * $�Ƿ���daily
     * @return {boolean}
     */
    function isDaily(){
        var domain = getDomain(-1);
        return domain == 'net';
    }

    /**
     * $����token
     */
    function setToken(uploader,callback){
        if(!uploader) return false;
        var url = isDaily() && DAILY_TOKEN_API || LINE_TOKEN_API;
        io.jsonp(url,function(data){
            var token = data.value;
            if(token){
                var data = uploader.get('data');
                data['_tb_token_'] = token;
            }
            callback && callback(data);
        })
    }

    return setToken;
},{requires:['ajax']});
/**
 * @fileoverview mini��½������ͨ�ýӿڣ�
 * @author ��ƽ�����ӣ�<minghe36@126.com>
 **/
KISSY.add('gallery/uploader/1.5/plugins/miniLogin/miniLogin',function(S, Node, Base,token,ML) {
    var EMPTY = '';
    var $ = Node.all;

    function MiniLogin(config) {
        var self = this;
        //���ø��๹�캯��
        MiniLogin.superclass.constructor.call(self, config);
    }
    S.extend(MiniLogin, Base, /** @lends MiniLogin.prototype*/{
        /**
         * �����ʼ��
          * @private
         */
        pluginInitializer : function(uploader) {
            if(!uploader) return false;
            uploader.on('select',function(){
                var isLogin = ML.check();
                if(!isLogin){
                    var autoUpload = uploader.get('autoUpload');
                    var isSetUpload = false;
                    if(autoUpload){
                        uploader.set('autoUpload',false);
                        isSetUpload = true;
                    }
                    ML.show({}, function() {
                        token(uploader,function(){
                            uploader.uploadFiles();
                        });
                        if(isSetUpload) uploader.set('autoUpload',true)
                    });
                }
            })
        }
    }, {ATTRS : /** @lends MiniLogin*/{
        /**
         * �������
         * @type String
         * @default urlsInput
         */
        pluginId:{
            value:'miniLogin'
        }
    }});
    return MiniLogin;
}, {requires : ['node','base','../../token','tbc/mini-login/1.4.0/']});
/**
 * changes:
 * ���ӣ�1.4
 *           - �������
 */

