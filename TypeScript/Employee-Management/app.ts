
// this will help to store data locally 
document.addEventListener('DOMContentLoaded', () => {
    new EmployeeSystem();
});


// this class helps to understand EMS with parameter it's supposed to work
class EmployeeSystem {
    private employees: {
        id: string;
        name: string;
        email: string;
        department: string
    }[] = [];
    // we're generating random ids which will be matched with existing / pre-generated ids
    // this helps to handle error and search employee based on ids
    private currentId: string | null = null;

    constructor() {
        this.allEvents();
    }

    private allEvents(): void {

        // this helps to list down employee detail view
        document.getElementById('showListView')?.addEventListener('click', () => this.showView('list'));
        // this helps to fill form with employee details
        document.getElementById('showAddForm')?.addEventListener('click', () => this.addEmployeeDetailsForm());
        // this helps to submit form with above employee details
        document.getElementById('employeeForm')?.addEventListener('submit', (e) => this.submitForm(e));

        // filter functionality base on searched term
        document.getElementById('searchInput')?.addEventListener('input', () => this.filterDetails());

        // filter functionality based on department using drop down concept
        document.getElementById('departmentFilter')?.addEventListener('change', () => this.filterDetails());

        (window as any).emp = this;

    }

    // form filling
    private addEmployeeDetailsForm(): void {
        this.currentId = null;
        (document.getElementById('employeeForm') as HTMLFormElement).reset();
        document.getElementById('formTitle')!.textContent = 'Add New Employee';
        this.showView('form');
    }


    private submitForm(e: Event): void {
        // e.preventDefault();
        const form = e.target as HTMLFormElement;
        // storing in respective fields of the form which are there in HTML
        const employee = {
            id: this.currentId || Math.random().toString(2).substring(2, 3),
            name: (form.querySelector('#name') as HTMLInputElement).value,
            email: (form.querySelector('#email') as HTMLInputElement).value,
            department: (form.querySelector('#department') as HTMLSelectElement).value
        };
        // since we're filling name, email, department 
        // randomly generated id should match with existing id 
        if (this.currentId) {
            const index = this.employees.findIndex(emp => emp.id === this.currentId);
            this.employees[index] = employee;
        } else {
            this.employees.push(employee);
        }

        this.showView('list');
        this.displayEmployeeDetails();
    }

    // this helps to edit required fields in form present in HTML
    public editEmployee(id: string): void {
        const employee = this.employees.find(emp => emp.id === id);
        if (!employee) {
            return
        };

        this.currentId = employee.id;
        (document.getElementById('name') as HTMLInputElement).value = employee.name;
        (document.getElementById('email') as HTMLInputElement).value = employee.email;
        (document.getElementById('department') as HTMLSelectElement).value = employee.department;

        document.getElementById('formTitle')!.textContent = 'Edit Employee';
        this.showView('form');
    }

    public deleteEmployee(id: string): void {
        this.employees = this.employees.filter(emp => emp.id !== id);
        this.displayEmployeeDetails();
    }

    // concationation with empty string after selecting all elements and buttons of HTML
    private displayEmployeeDetails(employees = this.employees): void {
        const tbody = document.getElementById('employeeList');
        if (!tbody) return;

        tbody.innerHTML = employees.map(emp => `
                <tr>
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${emp.department}</td>
                    <td>${emp.email}</td>
                    <td>
                        <button onclick="emp.viewEmployee('${emp.id}')">View</button>
                        <button onclick="emp.editEmployee('${emp.id}')">Edit</button>
                        <button onclick="emp.deleteEmployee('${emp.id}')">Delete</button>
                    </td>
                </tr>
            `).join('');
    }
    // dsipaly everything on screen
    private showView(view: string): void {
        document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));

        if (view === 'list') {
            document.getElementById('showListView')?.classList.add('active');
            document.getElementById('formView')?.classList.add('hidden');
            document.getElementById('detailView')?.classList.add('hidden');
        } else {
            document.getElementById('showAddForm')?.classList.add('active');
            document.getElementById('formView')?.classList.remove('hidden');
        }
    }

    private filterDetails(): void {
        const search_term = (document.getElementById('searchInput') as HTMLInputElement).value;
        const department = (document.getElementById('departmentFilter') as HTMLSelectElement).value;

        // we're storing filtered data by comapring name / id / email with search term variable which is HTML input
        const filter_details = this.employees.filter(emp => {

            const mySearch =
                !search_term ||
                emp.name.includes(search_term) ||
                emp.id.includes(search_term) ||
                emp.email.includes(search_term);
            // department is coming from drop down HTML input which is handled here
            const matchesDepartment = !department || emp.department === department;

            return mySearch && matchesDepartment;

        });

        this.displayEmployeeDetails(filter_details);
    }


    // this helps to view employee all details
    public viewEmployee(id: string): void {
        const employee = this.employees.find(emp => emp.id === id);
        if (!employee) return;

        document.getElementById('employeeDetails')!.innerHTML = `
        <p><strong>ID:</strong> ${employee.id}</p>
        <p><strong>Name:</strong> ${employee.name}</p>
        <p><strong>Email:</strong> ${employee.email}</p>
        <p><strong>Department:</strong> ${employee.department}</p>
        `;

        document.getElementById('detailView')?.classList.remove('hidden');
    }

}
