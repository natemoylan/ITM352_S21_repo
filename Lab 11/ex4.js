function isNonNegInt(string_check, returnErrors = false) {
    errors = []; 
    if(Number(string_check) != string_check) errors.push('Not a number!');  
    if(string_check < 0) errors.push('Negative value!'); 
    if(parseInt(string_check) != string_check) errors.push('Not an integer!'); 
    return returnErrors ? errors : (errors.length == 0);
    }
    
    attributes  =  "Nate;20;MIS"; 
    parts = attributes.split(';');
    
    for(part of parts) {
        console.log(isNonNegInt(part));
    }