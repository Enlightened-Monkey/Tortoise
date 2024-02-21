// Attaches an event listener to a button for executing commands when clicked
document.getElementById("commandbutton").addEventListener("click", clicked);

// Retrieves the command from an input field
var command = document.getElementById("command").value;

// Canvas setup for drawing
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Initializes the drawing position to the center of the canvas and sets the initial angle
var currentposition = [canvas.width/2, canvas.height/2];
var currentangle = 0;

// Controls whether the pen is up (not drawing) or down (drawing)
var isdrawing = true;

// Creates an image element for the tortoise icon and sets its source
var image = document.createElement("img");
image.src = "tortoise.png";

// Updates the UI to show the current state of the tortoise (position and angle)
function updateTortoiseState() {
    document.getElementById("current_state").innerHTML = "x: " + currentposition[0].toFixed(2) + " y: " + currentposition[1].toFixed(2) + " angle: " + currentangle.toFixed(2);
    document.getElementById("tortoise").style.left = currentposition[0] + "px";
    document.getElementById("tortoise").style.top = (currentposition[1] + 15) + "px";
    document.getElementById("tortoise").style.transform = "rotate(" + (-parseFloat(currentangle)) + "deg)";
}
updateTortoiseState(); // Initial state update

// Modal dialog functionality for the "Info" button
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "block";
};
span.onclick = function() {
    modal.style.display = "none";
};
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Pen control functions to stop/start drawing
function penup() {
    isdrawing = false;
}
function pendown() {
    isdrawing = true;
}
function forward(distance)
{
    // Begin a new path before starting to draw anything new
    ctx.beginPath();

    // Move to the current position to start the new line
    ctx.moveTo(currentposition[0], currentposition[1]);

    // Calculate the new position
    currentposition[0] -= Math.cos(currentangle * (Math.PI / 180)) * distance;
    currentposition[1] += Math.sin(currentangle * (Math.PI / 180)) * distance;

    // Draw if the pen is down
    if (isdrawing) {
        ctx.lineTo(currentposition[0], currentposition[1]);
        ctx.stroke();
    }
    document.getElementById("current_state").innerHTML = "x: " + currentposition[0].toFixed(2) + " y: " + currentposition[1].toFixed(2) + " angle: " + (currentangle % 360).toFixed(2);
    document.getElementById("tortoise").style.left = currentposition[0]+"px";
    document.getElementById("tortoise").style.top = currentposition[1]+15+"px";
        

}
function turn(angle)
{
    // Updates the current angle of the tortoise by adding the specified angle to it.
    currentangle += parseFloat(angle);

    // Updates the UI to reflect the new angle of the tortoise.
    document.getElementById("current_state").innerHTML = "x: " + currentposition[0].toFixed(2) + " y: " + currentposition[1].toFixed(2) + " angle: " + (currentangle % 360).toFixed(2);
    document.getElementById("tortoise").style.transform = "rotate("+(-parseFloat(currentangle))+"deg)";
}

function polygon(n, length)
{
    n = parseInt(n);
    length = parseFloat(length);
    
    // Calculates the sum of the interior angles of the polygon.
    var anglessum = (n - 2) * 180;
    
    // Loops through each side of the polygon.
    for (let i = 0; i < n; i++) {
        forward(length);
        turn(parseFloat(180 - anglessum / n));
    }
}

function graph(n, length)
{

// Calculates the sum of the interior angles of the polygon.
anglessum = (n-2)*180;

// Calculates the diagonal length based on the side length and the number of sides.
diagonallength = (length* Math.cos(((n-2)*180)/(n*(n-2))*(Math.PI/180)))*2;

// Loops through each vertex of the polygon.
for (let i = 0; i < n; i++) {

    turn(180-anglessum/n);

    // Initializes variables for the current and previous diagonal lengths.
    c = diagonallength;
    previousc = length;

    // Iterates to draw lines based on calculated diagonal lengths.
    for(let z = 0; z < n-3; z++) {
        // Calculates the length of the next line to draw, except for the first iteration.
        if (z > 0) {
            c = (length**2 + previousc**2 - 2*length*previousc*Math.cos((anglessum/n - ((anglessum/n)/(n-2)*z))*(Math.PI/180)))**0.5;
        }

        // Turns and draws the calculated line, then returns to the starting point without drawing.
        turn(parseFloat((180-anglessum/n)/2));
        forward(c);
        penup();
        forward(-c);
        pendown();

        // Updates the previous diagonal length for the next iteration.
        previousc = c;
    }

    // Adjusts the turn for the next segment based on the polygon's geometry.
    turn(-((anglessum/n)/(n-2))*(n-3));

    forward(length);
}

    
}
//not usable function
//graph2 1,1;200,100;40,50 243,213;212,10
function bipartite_graph(first_group, second_group)
{

    first_group = first_group.toString().split(";");
    for(let z=0;z<first_group.length;z++)
    {
        first_group[z] = first_group[z].toString().split(",");
        first_group[z][0] = parseFloat(first_group[z][0]);
        first_group[z][1] = parseFloat(first_group[z][1]);
    }
    second_group = second_group.toString().split(";");
    for(let z=0;z<second_group.length;z++)
    {
        second_group[z] = second_group[z].toString().split(",");
        second_group[z][0] = parseFloat(second_group[z][0]);
        second_group[z][1] = parseFloat(second_group[z][1]);
    }
    console.log(first_group);
    console.log(second_group);
    pendown();
    var angle = 0;
    var distance = 0;
    for(let i = 0; i < first_group.length; i++)
    {
        if(currentposition != first_group[i])
        {
            distance = Math.sqrt((currentposition[0]-first_group[i][0])**2+(currentposition[1]-first_group[i][1])**2);
            console.log(currentposition[0], first_group[i][0], currentposition[1], first_group[i][1])
            angle = Math.atan2(Math.abs(currentposition[0]-first_group[i][0]), Math.abs(currentposition[1]-first_group[i][1]))* 180 / Math.PI;
            if(currentposition[0]>first_group[i][0])
            {
                if(currentposition[1]>first_group[i][1])
                {
                    currentangle=-90;
                    turn(-(90-angle));
                }
                else
                {
                    currentangle=-90;
                    turn((90-angle));  
                }

            }
        else
        {
            if(currentposition[1]>first_group[i][1])
            {
                currentangle=90;
                turn((90-angle));
            }
            else
            {
                currentangle=90;
                turn(-(90-angle));  
            }
        }
        penup();
        forward(distance);
        pendown();
        console.log(currentposition);
        }
        
            for(let x = 0; x < second_group.length; x++)
            {
                distance = ((first_group[i][0]-second_group[x][0])**2+(first_group[i][1]-second_group[x][1])**2)**0.5;
                angle = Math.atan2(Math.abs(first_group[i][0]-second_group[x][0]), Math.abs(first_group[i][1]-second_group[x][1]))* 180 / Math.PI;

                if(currentposition[0]>second_group[x][0])
                {
                    if(currentposition[1]>second_group[x][1])
                    {
                        currentangle=-90;
                        turn(-(90-angle));
                    }
                    else
                    {
                        currentangle=-90;
                        turn((90-angle));  
                    }

                }
                else
                {
                    if(currentposition[1]>second_group[x][1])
                    {
                        currentangle=90;
                        turn((90-angle));
                    }
                    else
                    {
                        currentangle=90;
                        turn(-(90-angle));  
                    }
                }
                forward(distance);
                penup();
                forward(-distance);
                pendown();

            }
        
    }
    
}

function sierpinski_triangle(distance, limit)
{
    // Checks if the recursion limit has been reached.
    if(limit > 0) {
        // Recursively draws three smaller Sierpinski triangles at half the size.
        sierpinski_triangle(distance/2, limit-1);
        sierpinski_triangle(distance/2, limit-1);
        
        // Moves the drawing cursor to the correct position for the next triangle without drawing.
        penup();
        turn(-120);
        forward(distance/2);
        turn(-60);
        forward(distance/2);
        turn(180);
        pendown();
        
        // Draws the third triangle.
        sierpinski_triangle(distance/2, limit-1);
        
        // Moves the cursor back to the starting position of the current triangle.
        penup();
        turn(60);
        forward(distance/2);
        turn(-60);
        pendown();
    } 
    else 
    {
        // Draws a single equilateral triangle if the recursion limit is reached.
        turn(-60);
        forward(distance);
        turn(120);
        forward(distance);
        turn(120);
        forward(distance);
        turn(180);
        penup();
        forward(distance);
        pendown();
    }


}
function koch(angle, distance, limit)
{
    // Sets the initial direction of the line.
    turn(angle);

    // Checks if the recursion limit has been reached.
    if(limit > 0) 
    {
        // Divides the line into four segments, applying the Koch snowflake rules to each.
        koch(0, distance/3, limit - 1);
        koch(-60, distance/3, limit - 1);
        koch(120, distance/3, limit - 1);
        koch(-60, distance/3, limit - 1);
    } 
    else {
        // Draws a straight line if the recursion limit is reached.
        forward(distance/3);
        turn(-60);
        forward(distance/3);
        turn(120);
        forward(distance/3);
        turn(-60);
        forward(distance/3);
    }
}
function koch2(numberofedges, distance, limit)
{
    // Calculates the internal angle of the polygon based on the number of edges.
    angle = (numberofedges-2)*180/numberofedges;

    // Loops through each edge of the polygon.
    for(let i = 0; i < numberofedges; i++) {
        // Draws the Koch fractal on each edge.
        koch(0, distance, limit);
        
        // Turns to the next edge of the polygon.
        turn(parseFloat((180 - angle)));
    }

}
function resetCanvas() {
    // Clear the canvas content
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset the current position and angle if you are keeping track of a "tortoise"
    currentposition = [canvas.width / 2, canvas.height / 2];
    currentangle = 0;

    // Reset drawing state if necessary
    isdrawing = true;

    // Update the tortoise's position and angle visually if needed
    document.getElementById("tortoise").style.left = currentposition[0] - 15 + "px";
    document.getElementById("tortoise").style.top = currentposition[1] + 15 + "px";
    document.getElementById("tortoise").style.transform = "rotate(" + (-parseFloat(currentangle)) + "deg)";

    // Update any other elements or variables related to the canvas state
    document.getElementById("current_state").innerHTML = "x: " + currentposition[0] + " y: " + currentposition[1] + " angle: " + currentangle;

    // Add more reset actions as needed based on your application's functionality
}
function clicked()
{ 
    document.getElementById("history").innerHTML = document.getElementById("command").value;
    command = document.getElementById("command").value.split(" ");
    console.log(command[0] + " " + command[1]);
    document.getElementById("command").value = "";
    
    switch(command[0]){  
        case 'pen_up':
            penup();
            break;
        case 'pen_down':
            pendown();
            break;
        case 'forward':
            forward(command[1]);
            break;
        case 'turn':
            turn(command[1]);
            break;
        case 'polygon':
            polygon(command[1], command[2]);
            break;
        case 'graph':
            graph(command[1], command[2]);
            break;
        // case 'graph2':
        //     bipartite_graph(command[1], command[2]);
        //     break;
        case 'koch':
            koch2(command[1], command[2], command[3]); 
            break;
        case 'sierpinski':
            sierpinski_triangle(command[1], command[2]); 
            break;   
        case 'reset':
            resetCanvas();
            break;
        default : 
            console.log("niepoprawna komenda");
            
            return 0; 
            
}

}