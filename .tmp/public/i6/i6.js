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

	function showModalCRUD(uri){
		$.get(uri, function(data, status){
			$('#modal-crud').find(".modal-crud-content").html(data);
			$('#modal-crud .modal-crud-title').html($('#modal-crud').find('div.title').html())
			$('#modal-crud').find('div.title').remove();
	    	$('#modal-crud').modal('show');
		});
	}
	
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
                    //$('#modal-pop').modal('show');
                    showModalCRUD(currentpath + "/new");
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
		var _id=$(this).attr('rowid');
        showModalCRUD(currentpath + "/detail?id=" + _id);
	});


	$('table').on('click', 'button.edit',function() {
		var _id=$(this).attr('rowid');
        showModalCRUD(currentpath + "/edit?id=" + _id);
	});


	$(document).on('submit', '#form-crud', function(e) {
		e.preventDefault();

		var data = $(this).serialize();
		var method = $(this).attr('method');
		var id = $(this).find('input[name="id"]').val();
		id = typeof(id)=='undefined' ? "" : id;
		$.ajax({
			url: currentpath + '/' + id,
			type: method,
			data : data,
			success: function(result,status,xhr) {
				swal('Success', "", 'success');
	    		$('#modal-crud').modal('hide');
				$('table').DataTable().ajax.reload();
			},
			error: function(result,status,error){
				swal('Failed', "", 'error');				
			}
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
});
