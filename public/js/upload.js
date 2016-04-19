var cutter = new jQuery.UtrialAvatarCutter(
    {
        content : "avatar_preview",
        purviews : [
            {id:"avatar_large",width:140,height:140},
            {id:"avatar_big",width:64,height:64},
            {id:"avatar_small",width:30,height:30}
        ],
        selector : {width:200,height:200}
    }
);

//ajax文件上传
function ajaxFileUploadview(imgid,url){
    $.ajaxFileUpload
    ({
        url:url,
        secureuri:false,
        fileElementId:imgid,
        data:{name:'logan', id:'id'},
        dataType: 'json',
        success: function (data, status){
            if(data.success){
                var img = data.url;
                $(".avatar_preview img").removeAttr("src");
                $(".avatar_preview").find("img").attr("src",img+"?date="+Math.random(1));
                $("<img/>") // 在内存中创建一个img标记
                    .attr("src", img)
                    .load(function() {
                        $(".avatar_preview label").hide();
                        $(".avatar_action").show();
                        init_crop();
                    });
            }else{
                alert(data.message)
            }
        },
        error: function (data, status, e)
        {
            alert("出错了，请重新刷新上传！")
        }
    });
    return false;
}
//input file多次触发
function fileOnchage(){
    var content = '<input id="avatar_file" name="avatar_file" class="file_input" type="file" onchange="fileOnchage();" />';
    var $this = $(".file_input");
    file_path=$this.val();
    if(typeof FileReader === 'undefined'){
        var filepath =/^[A-Z]:\\{1,2}[^/:\*\?<>\|]+\.(jpg|gif|png|bmp)$/i;
        if(!filepath.test(file_path))
        {
            alert("请选择正确的图片。");
            $this.replaceWith(content);
            return false;
        }
        //IE本地无法判断大小
    }else{
        file = $this[0].files[0];
        file_size = Math.round(file.size/1024*100)/100;
        if(!/image\/\w+/.test(file.type)){
            alert("请选择图片文件！eto: jpg,png,gif,bmp.");
            $this.replaceWith(content);
            return false;
        }
        if(file_size>1024){
            alert("图片应小于1024KB");
            $this.replaceWith(content);
            return false;
        }
    }
    ajaxFileUploadview('avatar_file','/upload/avatar');
    $(".file_input").replaceWith(content);
}

//初始化裁剪
var file_status=false;
function init_crop(){
    $("#avatar_preview img").removeAttr("style");
    $(".jcrop-holder").remove();
    setTimeout("cutter.init()",50);
    file_status=true;
}

$(function(){
    //触发
    $(".pop_upload_avatar label").click(function(){
        //$(".file_input").trigger("click");
    });
    //解决第二次触发问题 以及IE 需要点击 input 的BUG
    $(".file_input").on("change", function(){
        fileOnchage();
    });
    //当弹出层显示的时候
    $('#ModalAvatar').on('shown.bs.modal', function (e) {
        //判断是否已经上传过图片了
        var img_file = $("#avatar_file").attr("value") || $("#avatar_file").data("val");
        if(img_file){
            $(".avatar_preview").find("img").attr("src",img_file).load(function() {
                $(".avatar_preview label").hide();
                $(".avatar_action").show();
                init_crop();
            });

        }
    });

    //保存，再次ajax提交裁剪数据
    $("#save").click(function(){
        if(file_status){
            var data = cutter.submit();
            $("#file_data").val(JSON.stringify(data));
            $.post('/upload/avatar', data, function (data) {
                if (data.success) {
                    $('#ModalAvatar').modal('hide');
                    //页面重新加载
                    location.reload();
                }else{
                    alert(data.message)
                }
            }, 'json');
        }else{
            alert("请选择图片!")
        }
    });
});