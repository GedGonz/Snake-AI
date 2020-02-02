function Position(x,y){
    var pos = {
        x : x,
        y : y,
        intersects : intersects
    }
    
    return pos;

    function intersects(obj){
        return (pos.x == obj.x && pos.y == obj.y);
    }
    
}