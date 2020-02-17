var budgetController = (function(){
   var Expense = function(id, description, value){
       this.id = id;
       this.description = description;
       this.value = value;
   }
   
   var Income = function(id, description, value){
       this.id = id;
       this.description = description;
       this.value = value;
   }

   var calculateTotal = function(type){
    var sum = 0;
        
    data.allItems[type].forEach(function(cur){
        sum = sum + cur.value;
    })
    data.totals[type] = sum;
   }
   
   var data = {
       allItems: {
           exp: [],
           inc: [],
       },
       
       totals: {
           exp: 0,
           inc: 0 
       },

       budget:0,

       percentage: -1
   }
   
   return {
       addItem: function(type, des, val){
        if (data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else {
            ID = 0;
        }
        
        // Create new item based on 'inc' or 'exp' type
        if (type === 'exp') {
            newItem = new Expense(ID, des, val);
        } else if (type === 'inc') {
            newItem = new Income(ID, des, val);
        }
        
        // Push it into our data structure
        data.allItems[type].push(newItem);
        
        // Return the new element
        return newItem;
    },

    deleteItem: function(type, id){

    }, 
    
    calculateBudget: function(){

        calculateTotal('inc')
        calculateTotal('exp')

        data.budget = data.totals.inc - data.totals.exp;
        if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
        }else {
            data.percentage = -1;
        }

    }, 

    getBudget: function(){
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percent: data.percentage
        }
    }, 

    testing: function(){
        console.log(data);
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
        expenseContainer: '.expenses__list',
        budget: '.budget__value',
        budgetInc: '.budget__income--value',
        budgetExp: '.budget__expenses--value',
        budgetPercent: '.budget__expenses--percentage',
        container: '.container'

    };

    return {
        getInput: function(){ 
            return {
                addType: document.querySelector(DOMStrings.type).value,
                addDescription: document.querySelector(DOMStrings.description).value,
                addValue: parseFloat(document.querySelector(DOMStrings.value).value)
            };
                     
        },

        addValue: function(obj){
                document.querySelector(DOMStrings.budget).textContent =  obj.budget;
                document.querySelector(DOMStrings.budgetInc).textContent = obj.totalInc;
                document.querySelector(DOMStrings.budgetExp).textContent = obj.totalExp;
                if(obj.percent > 0){
                    document.querySelector(DOMStrings.budgetPercent).textContent = obj.percent + '%';
                }else{
                    document.querySelector(DOMStrings.budgetPercent).textContent = '--'
                }
               

        },
        
        addListItem: function(obj, type){
            var html, newItem, element;
            
            if(type === 'inc'){
//                do somthing
                element = DOMStrings.incomeContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type === 'exp'){
//                do something
                element = DOMStrings.expenseContainer
                html = ' <div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                
            }
            
            newItem = html.replace('%id%', obj.id)
            newItem = newItem.replace('%description%', obj.description)
            newItem = newItem.replace('%value%', obj.value)
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newItem)
        },
        // cleared out the bug
        clearfields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.description + ', ' + DOMStrings.value);

            fieldsArr = Array.prototype.slice.call(fields);
            // a little bug here am trying to fix here 
            fieldsArr.forEach(function(current){
                current.value = "";
            })
            fieldsArr[0].focus()
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
    document.querySelector(DOM.container).addEventListener('click', deleteItemController)
    
    document.addEventListener('keypress', function(e){
        if(e.keyCode === 13){
            addItemController()
        }
    });
        
    }
    var updateBudget = function(){
        budgetCtrl.calculateBudget();

        var budget = budgetCtrl.getBudget();

        UIctrl.addValue(budget)

        console.log(budget);

    }
    var addItemController = function(){
        var inputs, items;
//   get input values
            
         inputs = UIctrl.getInput();
//   add new item to data structure
    // working perfectly now although i fixed the bug
        if(inputs.addDescription !== "" && !isNaN(inputs.addValue) && inputs.addValue > 0){
        items = budgetCtrl.addItem(inputs.addType, inputs.addDescription, inputs.addValue)
//   add item to the UI
        UIctrl.addListItem(items, inputs.addType);

//   clearing out input fields
        UIctrl.clearfields();

        updateBudget()

        }
//   calculate the budget
//   update the UI
    }
    var deleteItemController = function(event){
        var itemID, splitID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        splitID = itemID.split('-');
        // console.log(splitID);

    }
    return {
        init: function(){
            setUpEventListners();
            console.log('application has started.')
            updateBudget();
        }
    }
   
})(budgetController, UIController)

controller.init();