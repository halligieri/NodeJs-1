$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});
var socket = io();
window.onload = function(){
    socket.on('connect', function () {
        canvas = document.getElementsByTagName('canvas')[0].getContext('2d'),
                click = false,
                img = new Image(500, 300);

        img.src = $('#idEditImage').val();
        img.onload = function () {
            canvas.drawImage(img, 10, 10, 480, 280);
        };

        $(window).mousedown(function () {
            click = true;
        });

        $(window).mouseup(function () {
            click = false;
        });

        $('canvas').mousedown(function (e) {
            draw(e.pageX, e.pageY);
        });

        $('canvas').mouseup(function (e) {
            draw(e.pageX, e.pageY);
        });

        $('canvas').mousemove(function (e) {
            if (click === true) {
                socket.emit('draw', {pageX : e.pageX, pageY : e.pageY});
                draw(e.pageX, e.pageY);
            }
        });

        socket.on('move',function(e){
            draw(e.pageX, e.pageY);
        });

        function draw(xPos, yPos){
            canvas.beginPath();
            canvas.fillStyle = $('input[type=color]').val();
            canvas.arc(xPos - $('canvas').offset().left, yPos - $('canvas').offset().top, $('input[type=range]').val(), 0, 2 * Math.PI);
            canvas.fill();
            canvas.closePath();
        }
    });
};
