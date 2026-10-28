const $ = (id) => document.getElementById(id);

// Calculator
$("calculate").addEventListener("click", () => {
  const a = Number($("numA").value), b = Number($("numB").value), op = $("operator").value;
  if ($("numA").value.trim() === "" || $("numB").value.trim() === "") {
    $("calcResult").textContent = "Please enter both numbers."; return;
  }
  if (op === "/" && b === 0) { $("calcResult").textContent = "Cannot divide by zero."; return; }
  const result = ({"+": a+b, "-": a-b, "*": a*b, "/": a/b})[op];
  $("calcResult").textContent = `Result: ${Number(result.toFixed(8))}`;
});

// Number guessing game
let secret = newSecret(), attempts = 0;
function newSecret(){ return Math.floor(Math.random()*20)+1; }
$("guessBtn").addEventListener("click", checkGuess);
$("guessInput").addEventListener("keydown", e => { if(e.key === "Enter") checkGuess(); });
function checkGuess(){
  const raw = $("guessInput").value, guess = Number(raw);
  if(raw.trim()==="" || !Number.isInteger(guess) || guess<1 || guess>20){
    $("guessResult").textContent = "Enter a whole number from 1 to 20."; return;
  }
  attempts++;
  if(guess===secret){ $("guessResult").textContent = `Correct! You got it in ${attempts} guess${attempts===1?"":"es"}.`; $("secretNumber").textContent=secret; }
  else $("guessResult").textContent = guess<secret ? "Too low — try a higher number." : "Too high — try a lower number.";
}
$("newGame").addEventListener("click",()=>{secret=newSecret();attempts=0;$("guessInput").value="";$("secretNumber").textContent="?";$("guessResult").textContent="New game started. Make a guess!";});

// Password generator
$("passLength").addEventListener("input",()=> $("lengthLabel").textContent=$("passLength").value);
function generatePassword(){
  let chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if($("includeNumbers").checked) chars+="0123456789";
  if($("includeSymbols").checked) chars+="!@#$%&*?-_+";
  if(chars.length===52){$("passwordOutput").textContent="Select numbers or symbols too.";return;}
  let out="";
  const bytes=new Uint32Array(Number($("passLength").value));
  if(window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(bytes);
  else for(let i=0;i<bytes.length;i++) bytes[i]=Math.floor(Math.random()*100000);
  for(const n of bytes) out+=chars[n%chars.length];
  $("passwordOutput").textContent=out;
}
$("generatePass").addEventListener("click",generatePassword);
$("copyPass").addEventListener("click",async()=>{
  const value=$("passwordOutput").textContent;
  if(!value || value==="Click generate" || value.startsWith("Select")) return;
  try{$("copyPass").textContent="Copied!";await navigator.clipboard.writeText(value);}
  catch{$("copyPass").textContent="Select and copy manually";}
  setTimeout(()=> $("copyPass").textContent="Copy password",1600);
});

// Temperature converter
function convertTemp(){
  const raw=$("tempInput").value, val=Number(raw), mode=$("tempMode").value;
  if(raw.trim()==="" || !Number.isFinite(val)){$("tempResult").textContent="Enter a temperature.";return;}
  if(mode==="c-f") $("tempResult").textContent=`${val}°C = ${(val*9/5+32).toFixed(2).replace(/\.00$/,"")}°F`;
  else $("tempResult").textContent=`${val}°F = ${((val-32)*5/9).toFixed(2).replace(/\.00$/,"")}°C`;
}
$("convertTemp").addEventListener("click",convertTemp);
$("tempInput").addEventListener("keydown",e=>{if(e.key==="Enter")convertTemp();});

// To-do list (in-memory only)
$("todoForm").addEventListener("submit",e=>{
  e.preventDefault(); const input=$("todoInput"), value=input.value.trim(); if(!value)return;
  addTask(value);input.value="";input.focus();
});
function addTask(value){
  const empty=$("todoList").querySelector(".empty-state"); if(empty)empty.remove();
  const row=document.createElement("div");row.className="todo-item";
  const checkbox=document.createElement("input");checkbox.type="checkbox";checkbox.setAttribute("aria-label","Mark task complete");
  const label=document.createElement("span");label.textContent=value;
  checkbox.addEventListener("change",()=>row.classList.toggle("done",checkbox.checked));
  const del=document.createElement("button");del.className="delete-task";del.type="button";del.textContent="×";del.setAttribute("aria-label","Delete task");
  del.addEventListener("click",()=>{row.remove();if(!$("todoList").children.length)$("todoList").innerHTML='<p class="empty-state">No tasks yet — add your first one.</p>';});
  row.append(checkbox,label,del);$("todoList").append(row);
}

// Python code snippets
const snippets={
 hello:{file:"hello_world.py",code:'print("Hello, World!")'},
 even:{file:"even_or_odd.py",code:'number = int(input("Enter a number: "))\\n\\nif number % 2 == 0:\\n    print("Even number")\\nelse:\\n    print("Odd number")'},
 factorial:{file:"factorial.py",code:'number = int(input("Enter a positive number: "))\\nresult = 1\\n\\nfor i in range(1, number + 1):\\n    result *= i\\n\\nprint("Factorial:", result)'}
};
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t===tab));
  const snippet=snippets[tab.dataset.code];$("fileName").textContent=snippet.file;$("codeDisplay").textContent=snippet.code.replace(/\\n/g,"\n");$("copyCode").textContent="Copy code";
}));
$("copyCode").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText($("codeDisplay").textContent);$("copyCode").textContent="Copied!";}
  catch{$("copyCode").textContent="Select code to copy";}
  setTimeout(()=> $("copyCode").textContent="Copy code",1500);
});
convertTemp();
