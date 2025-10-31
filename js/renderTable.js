export function renderTable1(table,data)
{
    const tbody= table.querySelector("tbody")
    tbody.innerHTML='';
    for(let i=0;i<10;i++)
    {
        tbody.innerHTML+=`
        <tr>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        </tr>
        `
    }
   
}
export function renderTable2(table,data)
{
    const tbody= table.querySelector("tbody")
    tbody.innerHTML='';
    for(let i=0;i<10;i++)
    {
        tbody.innerHTML+=`
        <tr>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        <td>${Math.round(Math.random())*10}</td>
        </tr>
        `
    }
   
}