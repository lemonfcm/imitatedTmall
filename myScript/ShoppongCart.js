/**
 * Created by Administrator on 2017/5/8.
 */

/*以千进制格式化金额，比如金额是123456,就会显示成123,456*/
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
/*判断是否有商品被选中，只要有任意商品被选中了，就把结算按钮的颜色变为天猫红，并且是可点击状态，否则就是灰色，并且无法点击。*/
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
    /*同步"全选"状态。 选中和未选中是采用了两个不同的图片实现的，遍历所有的商品，看是否全部都选中了，只要有任意一个没有选中，
    那么就不是全选状态。 然后通过切换图片显示是否全选状态的效果。*/
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
/*显示被选中的商品总数，以及总价格。
 通过遍历每种商品是否被选中，累加被选中商品的总数和总价格，然后修改在上方的总价格，以及下方的总价格，总数*/
function  calcCartSumPriceAndNumber(){
    var totalNumber =0;
    var sum =0;
    $("img.cartProductItemIfSelected[selectit='selectit']").each(function(){
        var oiid = $(this).attr("oiid");
        var price = $(".cartProductItemSmallSumPrice[oiid="+oiid+"]").text();
        /*console.log(price);*/
        price = price.replace(/,/g,''); console.log(price);
        price = price.toString().replace(/￥/g, "");  /*因为含有中文字符，所以这里我先把它再转化一下toString*/
       /* console.log(price);*/
        sum += new Number(price);
        /*console.log(sum);*/
        var num = $(".orderItemNumberSetting[oiid="+oiid+"]").val();
        totalNumber += new Number(num);
    });
    $("span.cartTitlePrice").html("￥"+formatMoney(sum));
    $("span.cartSumPrice").html("￥"+formatMoney(sum));
    $("span.cartSumNumber").html(totalNumber);

}
/*据商品数量，商品价格，同步小计价格，接着调用calcCartSumPriceAndNumber()函数同步商品总数和总价格*/
function syncPrice(pid,num,price){
    $(".orderItemNumberSetting[pid="+pid+"]").val(num);
    var smallTatal = formatMoney(num*price);
    $("span.cartProductItemSmallSumPrice[pid="+pid+"]").html("￥"+smallTatal);
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

    /*选中一种商品*/
    $("img.cartProductItemIfSelected").click(function(){
        var option = $(this).attr("selectit");
        if(option == "selectit"){
            $(this).attr("src","img/site/cartNotSelected.png");
            $(this).attr("selectit","false");
            $(this).parents("tr.cartProductItemTR").css("background-color","#fff");
        }else{
            $(this).attr("src","img/site/cartSelected.png");
            $(this).attr("selectit","selectit");
            $(this).parents("tr.cartProductItemTR").css("background-color","#fff8e1");/*父类parents*/
        }
        syncSelect();
        syncCreateOrderButton();
        calcCartSumPriceAndNumber();
    });

    /*商品全选*/
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

    /*增加和减少数量*/
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
