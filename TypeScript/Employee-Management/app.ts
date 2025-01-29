

interface Employee {
    e_id: string;
    e_name: string;
    e_email: string;
    e_department: string;
}

// Employee Datatype With Form Required To Fill
// Following Class Implements Above Interface
class EmployeeClass {
    private employee_id: string | null = null;
    private employees: Employee[] = [];

    // Empty Constuctor
    constructor() {
        this.allEvents();
    }

    public allEvents(): void {

        // search employees
        document.getElementById('search')?.addEventListener('searchInput', () => this.modifyDetails());
        // filters employees
        document.getElementById('department')?.addEventListener('change', () => this.modifyDetails());
        // this helps to view employee list
        document.getElementById('showListView')?.addEventListener('click', () => this.employeeView('list'));
        // this helps to cancel form edited with employee details
        document.getElementById('cancelForm')?.addEventListener('click', () => this.employeeView('list'));
        // this helps to return to original list of employee
        document.getElementById('backToList')?.addEventListener('click', () => this.employeeView('list'));
        // this helps to fill form to add employee details
        document.getElementById('showAddForm')?.addEventListener('click', () => this.addForm());
        // this helps to fill employee form
        document.getElementById('employeeForm')?.addEventListener('submit', (e) => this.submitForm(e));

    }
}