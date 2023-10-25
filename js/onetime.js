window.onload = function () {
    let canvasPrinter = new CanvasPrinter();
    canvasPrinter.redrawAll(document.querySelector("#R-input").value);
    $.ajax({
        type: 'GET',
        url: 'php/main.php',
        async: false,
        success: function (serverAnswer){
            const jsonObject = JSON.parse(JSON.stringify(serverAnswer));
            document.getElementById("outputContainer").innerHTML = jsonObject.html;
            dots = jsonObject.dots;
            jsonObject.dots.forEach((dot) => {
                canvasPrinter.drawPoint(
                    dot.x,
                    dot.y,
                    dot.success
                )
            })
        }
    });

    document.getElementById("R-input").onchange = function () {
        if (validateR()) {
            canvasPrinter.redrawAll(document.querySelector("#R-input").value);
            dots.forEach((dot) => {
                canvasPrinter.drawPoint(
                    dot.x,
                    dot.y,
                    dot.success
                )
            })
        }
    };
    let button = document.querySelectorAll("input[type=text]");
    button.forEach((button) => {
        if (button.id === "Y-input") {
            button.addEventListener("input", validateY);
            button.addEventListener("focus", validateY);
        }
        else if (button.id === "R-input") {
            button.addEventListener("input", validateR);
            button.addEventListener("focus", validateR);
        }
    })

    document.getElementById('checkButton').onclick = function (){
        if (validateR() && validateY()) {
            let x = document.getElementById("X-input").value;
            let y = document.getElementById("Y-input").value.replace(',', '.');
            let r = document.getElementById('R-input').value.replace(',', '.')
            $.ajax({
                type: 'POST',
                url: 'php/main.php',
                async: false,
                data: { "x": x, "y": y, "r": r},
                success: function (serverAnswer){
                    const jsonObject = JSON.parse(JSON.stringify(serverAnswer));
                    document.getElementById("outputContainer").innerHTML = jsonObject.html;
                    dots.push({
                        'x': jsonObject.x,
                        'y': jsonObject.y,
                        'success': jsonObject.success
                    });
                    canvasPrinter.drawPoint(
                        jsonObject.x,
                        jsonObject.y,
                        jsonObject.success
                    );
                }
            });
        }
    }

    document.getElementById('clearButton').onclick = function (){
        $.ajax({
            type: 'POST',
            url: 'php/main.php',
            data: {'delete': 'all'},
            success: function (serverAnswer){
                const jsonObject = JSON.parse(JSON.stringify(serverAnswer));
                document.getElementById("outputContainer").innerHTML = jsonObject.html;
                dots = jsonObject.dots;
                canvasPrinter.redrawAll(document.querySelector("#R-input").value);
            }
        });
    }
};