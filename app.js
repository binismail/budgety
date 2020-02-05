var budgetController = (function(){
   var Expense = function(id, des, val){
       this.id = id;
       this.des = des;
       this.val = val;
   }
   
   var Income = function(id, des, val){
       this.id = id;
       this.des = des;
       this.val = val;
   }
   
   var data = {
       allItems: {
           exp: [],
           inc: [],
       },
       
       totals: {
           exp: 0,
           inc: 0 
       }
   }
   
   return {
       addItem: function(type, des, val){
           var newItem, ID;
           
           if(type === 'exp'){
               newItem = new Expense(ID, des, val)
           }else if(type === 'inc'){
               newItem = new Income(ID, des, val)
           }
           if(data.allItems[type].length > 0){
               ID = data.allItems[type][data.allItems[type].length].id + 1;
           }else{
               ID = 0;
           }
           
           
           data.allItems[type].push(newItem)
           return newItem;
           
       },
       testing: function(){
           console.log(data.allItems)
       }
   }
})()


var UIController = (function(){
    
    var DOMStrings = {
        type: '.add__type',
        description: '.add__description',
        value: '.add__value',
        button: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expense__list'
    };

    return {
        getInput: function(){ 
            return {
                addType: document.querySelector(DOMStrings.type).value,
                addDescription: document.querySelector(DOMStrings.description).value,
                addValue: document.querySelector(DOMStrings.value).value
            };
                     
        },
        
        addListItem: function(obj, type){
            var html, newItem, element;
            
            if(type === 'inc'){
//                do somthing
                element = DOMStrings.incomeContainer
                html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){
//                do something
                element = DOMStrings.expenseContainer
                '  <div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                
            }
            
            newItem = html.replace('%id%', obj.ID)
            newItem = newItem.replace('%description%', obj.des)
            newItem = newItem.replace('%value%', obj.val)
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newItem)
        },
        
        DOMItem : function(){
            return DOMStrings
        }
    }
    
    
    
})()

var controller = (function(budgetCtrl, UIctrl){    
    var setUpEventListners = function(){
    var DOM = UIctrl.DOMItem();
        
    document.querySelector(DOM.button).addEventListener('click', addItemController)
    
    document.addEventListener('keypress', function(e){
        if(e.keyCode === 13){
            addItemController()
        }
    });
        
    }
    var addItemController = function(){
        var inputs, items;
//   get input values
         inputs = UIctrl.getInput();
//   add new item to data structure
        items = budgetCtrl.addItem(inputs.addType, inputs.addDescription, inputs.addValue)
//   add item to the UI
        UIctrl.addListItem(items, inputs.addType);
//   calculate the budget
//   update the UI
    }
    return {
        init: function(){
            setUpEventListners();
            console.log('application has started.')
        }
    }
   
})(budgetController, UIController)

controller.init();