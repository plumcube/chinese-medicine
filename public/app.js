$(function() {
    console.log( "ready!" );

    function getResults(search) {
        let container = $("#results");
        container.empty();

        $.getJSON("/all", data => {
            console.log(data);
            data.map(item => {
                container.append(
                    `<div class="card" style="width: 300px; float:left; margin: 10px; height: 440px;">
                      <img class="card-img-top" src="http://libproject.hkbu.edu.hk/trsimage/mmd/`+item.img+`">
                      <div class="card-body">
                        <h5 class="card-title">`+item.name+`</h5>
                        <h5 class="card-title">`+item.english+`</h5>
                        <div>`+item.type+`</div>
                        <a href="#" class="btn btn-primary" style="bottom: 20px; position: absolute;">詳細資料</a>
                      </div>
                    </div>`
                );
            });
        });
    }  
    getResults();
});
