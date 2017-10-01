$('document').ready(function(){
	var currentpath = window.location.pathname;
    $('a[href="' + currentpath +  '"]').parent().addClass('active');
});