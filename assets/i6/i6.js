'use strict';

$('document').ready(function(){
	var currentpath = window.location.pathname;

	//ambil data-src properti dari kolom header
	var columns = [];
	$('table.i6-crud').find('thead').find('th[data-src]').each(function(ix){
		columns.push({data : $(this).attr('data-src')});
	});

	//tambahkan custom kolom
	columns.push(		
		{// this is Actions Column 
			"width": "13%",
			mRender: function (data, type, row) {
				var btnDetail = '<button rowid="' + row.id + '" type="button" class="detail btn btn-flat btn-info btn-sm" title="Detail"><i class="fa fa-eye"></i> </button>';
				var btnEdit = '<button rowid="' + row.id + '" type="button" class="edit btn btn-flat btn-warning btn-sm" title="Edit"><i class="fa fa-edit"></i> </button>';
				var btnDelete = '<button rowid="' + row.id + '" type="button" class="delete btn btn-flat btn-danger btn-sm" title="Delete"><i class="fa fa-trash"></i> </button>';

				return '<div class="btn-group">' + btnDetail + btnEdit + btnDelete + '</div>'; 
			}
		}
	);

	
	$('table.i6-crud').DataTable( {
        "processing": true,
        "serverSide": true,
        "ajax":  currentpath + "/list",
        "columns": columns,
        dom: '<"col-md-12"<"row"lf><"row"<"pull-right"B>>>rtip',
        buttons: [
            {
                text: '<i class="fa fa-plus"></i>',
                action: function ( e, dt, node, config ) {
                    $('#modal-edit').modal('show');
                },
                titleAttr: 'Add new record'
            },

            {
                extend:    'copyHtml5',
                text:      '<i class="fa fa-files-o"></i>',
                titleAttr: 'Copy'
            },
            {
                extend:    'excelHtml5',
                text:      '<i class="fa fa-file-excel-o"></i>',
                titleAttr: 'Excel'
            },
            {
                extend:    'csvHtml5',
                text:      '<i class="fa fa-file-text-o"></i>',
                titleAttr: 'CSV'
            },
            {
                extend:    'pdfHtml5',
                text:      '<i class="fa fa-file-pdf-o"></i>',
                titleAttr: 'PDF'
            }
        ]
    } );



	$('table').on('click', 'button.detail',function() {
		$.get(currentpath + '/' + $(this).attr('rowid'), function(data, status){
			var keys = Object.keys(data);
			keys.forEach(key=>{
				$('#modal-detail').find('[i6detail="' + key +'"]').html(data[key]);
			});
	    	$('#modal-detail').modal('show');
		});
	});


	$('table').on('click', 'button.delete',function() {
		var btn = $(this);
		swal({
			title: 'Delete',
			text: "Delete this data?",
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
			confirmButtonClass: 'btn btn-success',
			cancelButtonClass: 'btn btn-danger'
		}).then(function () {
			$.ajax({
				url: currentpath + '/' + btn.attr('rowid'),
				type: 'DELETE',
				success: function(result) {
					swal("Success", "data successfully deleted", "success");
					$('table').DataTable().ajax.reload();
				}
			});
		}, function (dismiss) {
			if (dismiss === 'cancel') {}
		});
	});


	$('table').on('click', 'button.edit',function() {
		var btn=$(this);
		$.get(currentpath + '/' + $(this).attr('rowid'), function(data, status){
			var keys = Object.keys(data);
			keys.forEach(key=>{
				$('#modal-edit').find('input[name="' + key +'"]').val(data[key]);
			});
			$('#modal-edit').find('form').attr('name', data.id);
	    	$('#modal-edit').modal('show');
		});
	});


	$(document).on('submit', '#form-update', function(e) {
		e.preventDefault();

		var data = $(this).serialize();
		var id = $(this).attr('name') ? $(this).attr('name') : "";
		$(this).removeAttr('name');

		$.post(currentpath + '/' + id , data, function(data,status) {
			$('#modal-kota-update').modal('hide');
			if (status) {
				swal('Success', status.msg, 'success');
	    		$('#modal-edit').modal('hide');
				$('table').DataTable().ajax.reload();
			} else {
				swal('Failed', status.msg, 'error');
			}
		});
	});
  	
});
