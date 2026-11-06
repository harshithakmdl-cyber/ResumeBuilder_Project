const fieldIds=["name","email","phone","address","summary","education","skills","projects","experience","certifications"];
const templateSelect=document.getElementById("templateSelect");
const resume=document.getElementById("resume");
function updateResume(){
 const val=id=>document.getElementById(id).value.trim();
 document.getElementById("previewName").textContent=val("name")||"Your Name";
 document.getElementById("previewContact").textContent=[val("email"),val("phone"),val("address")].filter(Boolean).join(" • ");
 ["summary","education","skills","projects","experience","certifications"].forEach(id=>{
   document.getElementById("preview"+id.charAt(0).toUpperCase()+id.slice(1)).textContent=val(id);
 });
}
fieldIds.forEach(id=>document.getElementById(id).addEventListener("input",updateResume));
templateSelect.addEventListener("change",()=>{resume.className="resume "+templateSelect.value;});
document.getElementById("printBtn").addEventListener("click",()=>{updateResume();window.print();});
function saveResume(){
 const data={};fieldIds.forEach(id=>data[id]=document.getElementById(id).value);
 data.template=templateSelect.value;
 data.sectionOrder=[...resume.querySelectorAll(".resume-section")].map(s=>s.dataset.section);
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="resume-data.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.getElementById("saveBtn").addEventListener("click",saveResume);
document.getElementById("loadBtn").addEventListener("click",()=>document.getElementById("fileInput").click());
document.getElementById("fileInput").addEventListener("change",event=>{
 const file=event.target.files[0];if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{try{
   const data=JSON.parse(reader.result);
   fieldIds.forEach(id=>document.getElementById(id).value=data[id]||"");
   templateSelect.value=data.template||"template1";resume.className="resume "+templateSelect.value;
   if(Array.isArray(data.sectionOrder)){data.sectionOrder.forEach(key=>{const section=resume.querySelector(`[data-section="${key}"]`);if(section)resume.appendChild(section);});}
   updateResume();
 }catch(e){alert("Could not load this file. Please choose a valid resume-data JSON.");}};
 reader.readAsText(file);event.target.value="";
});
document.getElementById("resetBtn").addEventListener("click",()=>{
 if(!confirm("Clear all resume fields?"))return;
 fieldIds.forEach(id=>document.getElementById(id).value="");
 templateSelect.value="template1";resume.className="resume template1";updateResume();
});
let dragged=null;
resume.querySelectorAll(".resume-section").forEach(section=>{
 section.addEventListener("dragstart",e=>{dragged=section;section.classList.add("dragging");e.dataTransfer.effectAllowed="move";});
 section.addEventListener("dragend",()=>{section.classList.remove("dragging");resume.querySelectorAll(".drop-target").forEach(x=>x.classList.remove("drop-target"));dragged=null;});
 section.addEventListener("dragover",e=>{e.preventDefault();if(section!==dragged)section.classList.add("drop-target");});
 section.addEventListener("dragleave",()=>section.classList.remove("drop-target"));
 section.addEventListener("drop",e=>{e.preventDefault();section.classList.remove("drop-target");if(!dragged||dragged===section)return;
 const all=[...resume.querySelectorAll(".resume-section")];
 if(all.indexOf(dragged)<all.indexOf(section))section.after(dragged);else section.before(dragged);
 });
});
updateResume();
