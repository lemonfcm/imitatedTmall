/**
 * Created by Administrator on 2017/5/8.
 */

/*��ǧ���Ƹ�ʽ������������123456,�ͻ���ʾ��123,456*/
function formatMoney(num) {
    num = num.toString().replace(/\$|,/g, '');
    if (isNaN(num)) num = "0";
    var sign = num == (num = Math.abs(num));
    num = Math.floor(num * 100 + 0.500000001);
    var cent = num % 100;
    num = Math.floor(num / 100).toString();
    if (cent < 10) cent = "0" + cent;
    var iterable_num = Math.floor(num.length/3);
    for (var i = 0; i <iterable_num; i++)/* Math.floor((num.length - (1 + i)) / 3)*/
        num = num.substring(0, num.length - 3 - 4 * i) + ',' + num.substring(num.length - 3 - 4 * i);
    return ((sign)?'':'-')+num+'.'+cent;
}
/*console.log(formatMoney("$-123,456.49"));*/
/*�ж��Ƿ�����Ʒ��ѡ�У�ֻҪ��������Ʒ��ѡ���ˣ��Ͱѽ��㰴ť����ɫ��Ϊ��è�죬�����ǿɵ��״̬��������ǻ�ɫ�������޷������*/
function syncCreateOrderButton(){
    var selectAny = false;
    $("img.cartProductItemIfSelected").each(function(){
        if("selectit"== $(this).attr("selectit"))
            selectAny = true;
    });
    if(selectAny){
        $("button.createOrderButton").css("background-color","#c40000");
        $("button.createOrderButton").removeAttr("disabled");
    }else{
        $("button.createOrderButton").css("background-color","#aaaaaa");
        $("button.createOrderButton").attr("disabled","disabled");
    }
}
    /*ͬ��"ȫѡ"״̬�� ѡ�к�δѡ���ǲ�����������ͬ��ͼƬʵ�ֵģ��������е���Ʒ�����Ƿ�ȫ����ѡ���ˣ�ֻҪ������һ��û��ѡ�У�
    ��ô�Ͳ���ȫѡ״̬�� Ȼ��ͨ���л�ͼƬ��ʾ�Ƿ�ȫѡ״̬��Ч����*/
function syncSelect(){
    var selectAll = true;
    $("img.cartProductItemIfSelected").each(function(){
        if("selectit" != $(this).attr("selectit"))
            selectAll = false;
    });
    if(selectAll){
        $("img.selectAllItem").attr("src","img/site/cartSelected.png");
    }else{
        $("img.selectAllItem").attr("src","img/site/cartNotSelected.png");
    }
}
/*��ʾ��ѡ�е���Ʒ�������Լ��ܼ۸�
 ͨ������ÿ����Ʒ�Ƿ�ѡ�У��ۼӱ�ѡ����Ʒ���������ܼ۸�Ȼ���޸����Ϸ����ܼ۸��Լ��·����ܼ۸�����*/
function  calcCartSumPriceAndNumber(){
    var totalNumber =0;
    var sum =0;
    $("img.cartProductItemIfSelected[selectit='selectit']").each(function(){
        var oiid = $(this).attr("oiid");
        var price = $(".cartProductItemSmallSumPrice[oiid="+oiid+"]").text();
        /*console.log(price);*/
        price = price.replace(/,/g,''); console.log(price);
        price = price.toString().replace(/��/g, "");  /*��Ϊ���������ַ��������������Ȱ�����ת��һ��toString*/
       /* console.log(price);*/
        sum += new Number(price);
        /*console.log(sum);*/
        var num = $(".orderItemNumberSetting[oiid="+oiid+"]").val();
        totalNumber += new Number(num);
    });
    $("span.cartTitlePrice").html("��"+formatMoney(sum));
    $("span.cartSumPrice").html("��"+formatMoney(sum));
    $("span.cartSumNumber").html(totalNumber);

}
/*����Ʒ��������Ʒ�۸�ͬ��С�Ƽ۸񣬽��ŵ���calcCartSumPriceAndNumber()����ͬ����Ʒ�������ܼ۸�*/
function syncPrice(pid,num,price){
    $(".orderItemNumberSetting[pid="+pid+"]").val(num);
    var smallTatal = formatMoney(num*price);
    $("span.cartProductItemSmallSumPrice[pid="+pid+"]").html("��"+smallTatal);
    calcCartSumPriceAndNumber();
}

function syncDelect(){
    var cartNum = $("tr.cartProductItemTR").length;
    if(cartNum>0){
        var selectAll = true;
        $("img.cartProductItemIfSelected").each(function(){
            if("selectit" != $(this).attr("selectit"))
                selectAll = false;
        });
        if(selectAll){
            $("img.selectAllItem").attr("src","img/site/cartSelected.png");
        }else{
            $("img.selectAllItem").attr("src","img/site/cartNotSelected.png");
        }
    }else{
        $("img.selectAllItem").attr("src","img/site/cartNotSelected.png");
    }
}




$(document).ready(function(){

    /*ѡ��һ����Ʒ*/
    $("img.cartProductItemIfSelected").click(function(){
        var option = $(this).attr("selectit");
        if(option == "selectit"){
            $(this).attr("src","img/site/cartNotSelected.png");
            $(this).attr("selectit","false");
            $(this).parents("tr.cartProductItemTR").css("background-color","#fff");
        }else{
            $(this).attr("src","img/site/cartSelected.png");
            $(this).attr("selectit","selectit");
            $(this).parents("tr.cartProductItemTR").css("background-color","#fff8e1");/*����parents*/
        }
        syncSelect();
        syncCreateOrderButton();
        calcCartSumPriceAndNumber();
    });

    /*��Ʒȫѡ*/
    $("img.selectAllItem").click(function(){
        var cartNum = $("tr.cartProductItemTR").length;
        if(cartNum>0){
            var optionAll = $(this).attr("selectit");
            if(optionAll == "selectit"){
                $("img.selectAllItem").attr("src","img/site/cartNotSelected.png");
                $("img.selectAllItem").attr("selectit","false");
                $("img.cartProductItemIfSelected").each(function(){
                    $(this).attr("src","img/site/cartNotSelected.png");
                    $(this).attr("selectit","false");
                    $(this).parents("tr.cartProductItemTR").css("background-color","#fff");
                });
            }else{
                $("img.selectAllItem").attr("src","img/site/cartSelected.png");
                $("img.selectAllItem").attr("selectit","selectit");
                $("img.cartProductItemIfSelected").each(function(){
                    $(this).attr("src","img/site/cartSelected.png");
                    $(this).attr("selectit","selectit");
                    $(this).parents("tr.cartProductItemTR").css("background-color","#fff8e1");
                });
            }
            syncCreateOrderButton();
            calcCartSumPriceAndNumber();
        }

    });

    /*���Ӻͼ�������*/
    $("a.numberPlus").click(function(){
        var  p = $(this).attr("pid");
        var stock = $("span.orderItemStock[pid="+p+"]").text();
        var price =$("span.orderItemPromotePrice[pid="+p+"]").text();
        var num = $(".orderItemNumberSetting[pid="+p+"]").val();
        num++;
        if(num>stock) num=stock;
        syncPrice(p,num,price);
    });
    $("a.numberMinus").click(function(){
        var  p = $(this).attr("pid");
        var stock = $("span.orderItemStock[pid="+p+"]").text();
        var price =$("span.orderItemPromotePrice[pid="+p+"]").text();
        var num = $(".orderItemNumberSetting[pid="+p+"]").val();
        num--;
        if(num<1) num=1;
        syncPrice(p,num,price);
    });
    $("input.orderItemNumberSetting").keyup(function(){
        var  p = $(this).attr("pid");
        var stock = $("span.orderItemStock[pid="+p+"]").text();
        var price =$("span.orderItemPromotePrice[pid="+p+"]").text();
        var num = $(".orderItemNumberSetting[pid="+p+"]").val();
        num = parseInt(num);
        if(isNaN(num)) num=1;
        if(num>stock) num=stock;
        if(num<1) num=1;
        syncPrice(p,num,price);
    });
    $("a.deleteOrderItem").click(function(){
        var option = $(this).attr("oiid");
        $("tr.cartProductItemTR[oiid="+option+"]").remove();
        syncDelect();
        syncCreateOrderButton();
        calcCartSumPriceAndNumber();
    });
});
