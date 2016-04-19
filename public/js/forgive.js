$(function(){
    if ($('[data-toggle="select"]').length) {
        $('[data-toggle="select"]').select2();
    }
    // jQuery UI Sliders
    var $slider = $('#slider');
    if ($slider.length > 0) {
        $slider.slider({
            min: 0,
            max: 10,
            value: 1,
            orientation: 'horizontal',
            range: 'min',
            slide: function( event, ui ) {
                var pe=[11,100,520,1314,2014,20134,52013,201314,1314520,5201314];
                console.log(pe[ui.value]+"人");
            }
        });
    }

    $("#invite").on("change",function(){
        if($(this).is(":checked")){
            $("#inviteEmail").show();
        }else{
            $("#inviteEmail").hide();
        }
    });
    $("#swtich_target").on("change",function(){
        if($(this).is(":checked")){
            $("#target_user").show();
        }else{
            $("#target_user").hide();
        }
    });

    var $like = $("#like_val");
    var $dislike = $("#dislike_val");
    function progress(){
        var total = 0+$like.data("like")+$dislike.data("dislike");
        $like.width(($like.data("like")/total)*100+"%");
        $dislike.width(($dislike.data("dislike")/total)*100+"%");
    }
    progress();

    $("#likes").on("click",function(){
        var data = {
            topic_id: $("#topic_id").val(),
            _csrf: $("#csrf").val()
        };
        $.post('/forgive/like', data, function (data) {
            if (data.status) {
                $like.data("like",data.like);
                $dislike.data("dislike",data.dislike);
                progress();
            }else{
                alert(data.message)
            }
        }, 'json');
    });
    $("#dislike").on("click",function(){
        var data = {
            topic_id: $("#topic_id").val(),
            _csrf: $("#csrf").val()
        };
        $.post('/forgive/dislike', data, function (data) {
            if (data.status) {
                $like.data("like",data.like);
                $dislike.data("dislike",data.dislike);
                progress();
            }else{
                alert(data.message)
            }
        }, 'json');
    });

    // 点赞
    $('.up_btn').each(function(){
        var $this = $(this);
        var replyId = $this.closest('li').attr('reply_id');
        $this.click(function (e) {
            $.ajax({
                url: '/reply/' + replyId + '/up',
                method: 'POST'
            }).done(function (data) {
                if (data.success) {
                    $this.removeClass('invisible');
                    var currentCount = Number($this.next('.up-count').text().trim()) || 0;
                    if (data.action === 'up') {
                        $this.next('.up-count').text(currentCount + 1);
                        $this.addClass('uped');
                    } else {
                        if (data.action === 'down') {
                            $this.next('.up-count').text(currentCount - 1);
                            $this.removeClass('uped');
                        }
                    }
                } else {
                    alert(data.message);
                }
            }).fail(function (xhr) {
                if (xhr.status === 403) {
                    alert('请先登录，登陆后即可点赞!。');
                }
            });
        });
    })
    // END 点赞

    // 加入收藏
    $('.collect_btn').click(function () {
        var $me = $(this);
        var action = $me.attr('action');
        var data = {
            topic_id: $me.data("topic_id")
        };
        var $countSpan = $('.collect-topic-count');
        $.post('/forgive/' + action, data, function (data) {
            if (data.status === 'success') {
                if (action == 'collect') {
                    $me.text('取消收藏');
                    $me.attr('action', 'de_collect');
                } else {
                    $me.text('加入收藏');
                    $me.attr('action', 'collect');
                }
                $me.toggleClass('span-success');
            }
        }, 'json');
    });
    // END 加入收藏

});