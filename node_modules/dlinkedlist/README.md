#DoublyLinkedListJS

Simple Doubly Linked List implemented in Javascript (Browserified).
https://github.com/ArcQ/DoublyLinkedListJS

Install:
```bash
npm install dlinkedlist
```
##Iteration

#####Apply To Every Node
To apply a callback function one very node, use list.applyToEveryNode() which takes 1-2 arguments:

1. callback (required), returns true if you want to continue (return true to apply to all nodes)
2. arg: optional, if you need to plug arguments into callback

```javascript
function MakeAllNodesZero(){
  var makeNodeZero = function(currentNode,arg){
    console.log(arg.test);
    currentNode.obj = 0;
    return true;
  }
  var callbackArgument = {test};
  linkedListTest.applyToEveryNode(makeNodeZero,callbackArgument);
}
```
//iterate takes 4-5 arguments

#####Iterate With Stop Condition
To iterate and apply your callback for a select number of nodes, use list.iterate() which takes 3-4 arguments

1. callback (required), returns true if you want to continue (return true to apply to all nodes)
2. isForward: true for forwards iteration(required) or false backwards iteration
3. starting node
4. ifCircular: true if you want tail's next to be head, head's prev to be tail
5. arg: optional, if you need to plug arguments into callback

```javascript
function Iterate(){   
    var i = 0;
    var iterateCallback = function(currentNode){
        currentNode.obj = i;
        i++;
        if(i<3){
            return true;
        }
        else{
            return false;
        }
    }
    var startingNode = linkedListTest.tail.prev;
    linkedListTest.iterate(iterateCallback,false,startingNode);
  }
```

##Basic Usage
#####Create
After importing DLinkedList.js
```javascript
var list = window.dLinkedList();
```
#####Basic Node Structure
```javascript
var node = {
		obj: obj,
		next: null,
		prev: null
	};
```

#####Push
```javascript
var newNode = list.push(1);
```

#####FindFirst
```javascript
var oneNode = linkedListTest.findFirst(1);
```

#####Insert
```javascript
//insert 8 after 5
var oneNode = linkedListTest.findFirst(1);
if (oneNode !== undefined)
{
    linkedListTest.insertAfter(oneNode,2);
    linkedListTest.insertBefore(oneNode,3);
}

```

####Remove
```javascript
oneNode = linkedListTest.findFirst(1);
linkedListTest.remove(oneNode);
```

####Get Next (Circular Linked List)
Use this function to retrive the next node if your linked list is linked in a circular manner.
```javascript
var oneNode = linkedListTest.findFirst(1);
var twoNode = linkedListTest.cGetNext(oneNode);
```

####Get Prev (Circular Linked List)
Use this function to retrive the previous node if your linked list is linked in a circular manner.
```javascript
var oneNode = linkedListTest.findFirst(1);
var threeNode = linkedListTest.cGetPrev(oneNode);
```

