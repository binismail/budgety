var budgetController = (function(){
   
    
})()


var UIController = (function(){

    return {
        getinput: function(){
            return {
                var type = document.querySelector('.add__type')
            }
        },
    }
    
    
    
})

var controller = (function(budgetCtrl, UIctrl){
    var addItemController = function(){
//   add event handler
        var inputs = UIctrl.getinput()
        console.log(inputs)
//   get input values
//   add new item to data structure
//   add i tem to the UI
//   calculate the budget
//   update the UI
    }
    
    document.querySelector('.add__btn').addEventListener('click', addItemController)
    
    document.addEventListener('keypress', function(e){
        if(e.keyCode === 13){
            addItemController()
        }
    })
})(budgetController, UIController)