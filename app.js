var budgetController = (function(){
   var Expense = function(id, description, value){
       this.id = id;
       this.description = description;
       this.value = value;
       this.percentage = -1;
   }
   Expense.prototype.calcPercentage = function(totalInc){
        if(totalInc > 0){
            this.percentage = Math.round((this.value / totalInc) * 100)
        }else{
            this.percentage = -1;
        }
   }

   Expense.prototype.getPercentage = function(){
       return this.percentage;
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
        var ids, index;
            ids = data.allItems[type].map(function(curr){
                return curr.id
            });
            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1)
            }

    }, 

    calculatePercentage: function(){
            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);
            });
    },

    getPercentages: function(){
        var allpecent = data.allItems.exp.map(function(curr){
            return curr.getPercentage()
        });

        return allpecent;
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
        container: '.container',
        percentageLable: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumber = function(num, type){
        var numSplit, init, dec, type;
        num = Math.abs(num)
        num = num.toFixed(2);

        numSplit = num.split('.')
        init = numSplit[0];
        if(init.length > 3){
            init = init.substr(0, init.length - 3) + ',' +  init.substr(init.length -3, 3)
        }

        type === 'exp' ? '-' : '+'
        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' '+ init + '.' + dec;
    }

    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i) 
        }
    }

    return {
        getInput: function(){ 
            return {
                addType: document.querySelector(DOMStrings.type).value,
                addDescription: document.querySelector(DOMStrings.description).value,
                addValue: parseFloat(document.querySelector(DOMStrings.value).value)
            };
                     
        },

        addValue: function(obj){
            var type;
                obj.budget > 0 ? type = 'inc' : type = 'exp';
                document.querySelector(DOMStrings.budget).textContent =  formatNumber(obj.budget, type);
                document.querySelector(DOMStrings.budgetInc).textContent = formatNumber(obj.totalInc, 'inc');
                document.querySelector(DOMStrings.budgetExp).textContent = formatNumber(obj.totalExp, 'exp');
                if(obj.percent > 0){
                    document.querySelector(DOMStrings.budgetPercent).textContent = obj.percent + '%';
                }else{
                    document.querySelector(DOMStrings.budgetPercent).textContent = '--'
                }
               

        },
        displayPercentages: function(percentages){

            var fields = document.querySelectorAll(DOMStrings.percentageLable);
                        nodeListForEach(fields, function(curr, index){
                if(percentages[index] > 0){
                    curr.textContent = percentages[index] + '%';
                }else{
                    curr.textContent = '--'
                }
                
            })

        },

        displayMonth: function(){
                var now, year, month, months;

                now = new Date();

                months = ['January', 'February', 'March', 'April', 'May','June', 'July', 'August', 'September', 'October', 'November', 'December']

                year = now.getFullYear();
                month = now.getMonth();

                document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        deleteListItem: function(selectedId){
            var el = document.getElementById(selectedId);
            el.parentNode.removeChild(el);
        },

        changetype: function(){
            var fields;

            fields = document.querySelectorAll(
                DOMStrings.type + ',' +
                DOMStrings.description + ',' +
                DOMStrings.value
            );

            nodeListForEach(fields, function(curr){
                curr.classList.toggle('red-focus')
            })

            document.querySelector(DOMStrings.button).classList.toggle('red-focus')
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
            newItem = newItem.replace('%value%', formatNumber(obj.value, type))
            
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
    document.querySelector(DOM.button).addEventListener('change', UIctrl.changetype)
        
    document.querySelector(DOM.button).addEventListener('click', addItemController)
    document.querySelector(DOM.container).addEventListener('click', deleteItemController)
    
    document.addEventListener('keypress', function(e){
        if(e.keyCode === 13){
            addItemController()
        }
    });
        
    }
    var updatePercentage = function(){
            budgetCtrl.calculatePercentage();

            var percentage = budgetCtrl.getPercentages()

            UIctrl.displayPercentages(percentage);
            console.log(percentage)
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
updatePercentage()
//   update the UI
    }
    var deleteItemController = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }
        
        budgetCtrl.deleteItem(type, ID)
        // console.log(splitID);
        // remove item from the UI
        UIctrl.deleteListItem(itemID);
        //update the budget
        updateBudget()

        updatePercentage()
    }
    return {
        init: function(){
            setUpEventListners();
            console.log('application has started.')
            updateBudget();
            UIctrl.displayMonth()
        }
    }
   
})(budgetController, UIController)

controller.init();