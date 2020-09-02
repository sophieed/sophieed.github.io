	// init Isotope
	var $grid = $('.grid').isotope({
	  // options
	});
	// filter items on button click
	$('.filter-button-group').on( 'click', 'a', function() {
	  var filterValue = $(this).attr('data-filter');
	  $grid.isotope({ filter: filterValue });
	});
	$('.button-group a.btn').on('click', function(){
		$('.button-group a.btn').removeClass('active');
		$(this).addClass('active');
	});