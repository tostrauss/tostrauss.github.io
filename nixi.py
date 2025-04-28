tasks = []  # List to store tasks

def show_menu():
    print("\nLIST OF TASKS")
    print("1. View Tasks")
    print("2. Add Task")
    print("3. Remove Task")
    print("4. Exit")

while True:
    show_menu()
    choice = input("\nEnter your choice (1-4): ")

    if choice == "1":
        if tasks:
            print("\nYour Tasks:")
            for i, task in enumerate(tasks, 1):
                print(f"{i}. {task}")
        else:
            print("\nNo tasks yet!")

    elif choice == "2":
        new_task = input("Enter a new task: ")
        tasks.append(new_task)
        print(f"Task '{new_task}' added!")

    elif choice == "3":
        if tasks:
            for i, task in enumerate(tasks, 1):
                print(f"{i}. {task}")
            try:
                task_num = int(input("Enter task number to remove: "))
                if 1 <= task_num <= len(tasks):
                    removed_task = tasks.pop(task_num - 1)
                    print(f"Task '{removed_task}' removed!")
                else:
                    print("Invalid task number!")
            except ValueError:
                print("Please enter a valid number.")
        else:
            print("No tasks to remove!")

    elif choice == "4":
        print("Goodbye! 👋")
        break

    else:
        print("Invalid choice, please enter a number between 1-4.")
