Here's the functionality of the extension. 
It should highlight the rows of the table based on what its "Rate" ÷ "Trip" is. Thats the rate per mile (RPM). 
Any row with rpm of 2.50 or higher is highlighted green, rpm between 1.50 and 2.50 the row is highlighted yellow, and rpm below 1.50 doesn't change color. 
This should run as soon as the page loads. 

 

Now there's the filtering capabilities They should be placed in the blue box in the attachment. 
There should be five inputs. Minimum miles, maximum miles, minimum offer, blocked cities, and blocked states. 
Minimum miles should check the "Trip" and see if it's higher than the minimum miles entered, if not then it should have a strikethrough. 
Maximum miles does the same. Minimum offer does the same but with the "Rate". 
Blocked cities should be entered with or without capitalization and be separated by commas. 
If a blocked city is entered and that city is part of the "Origin" or "Destination" then the row should have a strikethrough. 

 

There should be a RPM calculator too. 
It should be placed in the red box in the attachment. 
It has an Offer display that shows the “Rate” amount. 
It should take that “Rate” and divide it by the “Trip” + “DH-O”. 
So if the “Rate” is $1000 and the “Trip” is 400 and the “DH-O” is 100 then the RPM should be $2.  
There’s also a Rate Per Mile input that can change the Offer display. 
It changes it by taking “Rate” / “Trip” + “DH-O”. 
The RPM should also be able to move up and down by .25.

 

The other feature it needs is when you click on the email address in the row, it should open a pre-populated email. 
It should have the clicked row’s “Origin” city and state and the “Destination” city and state in the subject. 

And the email body should have a message.

 
If the row the user clicks has an “Origin” city and state of Cleveland, OH and the “Destination” city and state is Miami, FL 
then they click to email, the email should pop up and say Cleveland, OH to Miami, FL in the subject line. 
The body should say “Hello, this is _____ from _____________. 
I’m interested in the load going from Cleveland, OH to Miami, FL".
