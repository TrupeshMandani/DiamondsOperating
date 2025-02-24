
// "use client"

// import { motion, AnimatePresence } from "framer-motion"
// import { Plus, Search, UserPlus, X } from "lucide-react"
// import { useState , useEffect } from "react"
// import Sidebar from "../component/Sidebar"
// import { Button } from "../component/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { toast } from "sonner"

// const container = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// }

// const item = {
//   hidden: { opacity: 0, y: 20 },
//   show: { opacity: 1, y: 0 },
// }



// export default function EmployeeDashboard() {
//   const [employees, setEmployees] = useState([])
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedEmployee, setSelectedEmployee] = useState(null)
//   const [newEmployee, setNewEmployee] = useState({
//     name: "",
//     email: "",
//     role: "",
//     department: "",
//   })

//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

//   // Fetch employee data from backend on component mount
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await fetch("http://localhost:5023/api/auth/login", {
//           method: "GET", // Replace with the correct method (GET, POST, etc.)
//           headers: {
//             "Content-Type": "application/json",
//             // Add any necessary authentication headers here
//           },
//         })
        
//         if (!response.ok) {
//           throw new Error("Failed to fetch employees data")
//         }

//         const data = await response.json()
//         setEmployees(data) // Assuming the response is an array of employees
//       } catch (error) {
//         toast.error(error.message)
//       }
//     }

//     fetchEmployees()
//   }, [])
  

//   const handleAddEmployee = () => {
//     if (!newEmployee.name || !newEmployee.email || !newEmployee.role || !newEmployee.department) {
//       toast.error("Please fill in all fields")
//       return
//     }

//     const employee = {
//       id: employees.length + 1,
//       ...newEmployee,
//       joinDate: new Date().toISOString().split("T")[0],
//     }

//     setEmployees([...employees, employee])
//     setNewEmployee({ name: "", email: "", role: "", department: "" })
//     setIsAddDialogOpen(false)
//     toast.success("Employee added successfully")
//   }
  

//   const filteredEmployees = employees.filter(
//     (employee) =>
//       employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   return (
//     <div className="flex min-h-screen">
//       <div className="w-72 fixed inset-y-0 left-0 bg-[#121828] text-white shadow-lg z-30">
//         <Sidebar />
//       </div>
//       <main className="flex-1 ml-72 bg-[#f7f7f7]">
//         <div className="p-8">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex flex-col gap-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h1 className="text-2xl font-bold text-black">Employee Management</h1>
//                   <p className="text-gray-500">Manage your team members and their roles</p>
//                 </div>
//                 <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//                   <DialogTrigger asChild>
//                     <Button className="bg-[#236294] text-white hover:bg-[#236294]/90">
//                       <UserPlus className="mr-2 h-4 w-4" />
//                       Add Employee
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                       <DialogTitle>Add New Employee</DialogTitle>
//                       <DialogDescription>Enter the details of the new employee below</DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-4 py-4">
//                       <div className="grid gap-2">
//                         <Label htmlFor="name">Full Name</Label>
//                         <Input
//                           id="name"
//                           placeholder="Enter full name"
//                           value={newEmployee.name}
//                           onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
//                         />
//                       </div>
//                       <div className="grid gap-2">
//                         <Label htmlFor="email">Email</Label>
//                         <Input
//                           id="email"
//                           type="email"
//                           placeholder="Enter email address"
//                           value={newEmployee.email}
//                           onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
//                         />
//                       </div>
//                       <div className="grid gap-2">
//                         <Label htmlFor="role">Role</Label>
//                         <Input
//                           id="role"
//                           placeholder="Enter job title"
//                           value={newEmployee.role}
//                           onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
//                         />
//                       </div>
//                       <div className="grid gap-2">
//                         <Label htmlFor="department">Department</Label>
//                         <Select
//                           value={newEmployee.department}
//                           onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select department" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="Engineering">Engineering</SelectItem>
//                             <SelectItem value="Product">Product</SelectItem>
//                             <SelectItem value="Design">Design</SelectItem>
//                             <SelectItem value="Marketing">Marketing</SelectItem>
//                             <SelectItem value="Sales">Sales</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                     <div className="flex justify-end">
//                       <Button className="bg-[#236294] text-white hover:bg-[#236294]/90" onClick={handleAddEmployee}>
//                         <Plus className="mr-2 h-4 w-4" />
//                         Add Employee
//                       </Button>
//                     </div>
//                   </DialogContent>
//                 </Dialog>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//                   <Input
//                     className="pl-10 bg-white border-0 text-black"
//                     placeholder="Search employees..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <Separator className="my-4" />

//               <motion.div
//                 variants={container}
//                 initial="hidden"
//                 animate="show"
//                 className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
//               >
//                 {filteredEmployees.map((employee) => (
//                   <motion.div key={employee.id} variants={item} layoutId={`card-${employee.id}`}>
//                     <Card className="bg-white border-0 shadow-sm">
//                       <CardHeader>
//                         <CardTitle className="text-black text-xl font-semibold">{employee.name}</CardTitle>
//                         <CardDescription className="text-gray-500">{employee.role}</CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="grid gap-2 text-sm">
//                           <div className="flex justify-between">
//                             <span className="text-gray-500">Department:</span>
//                             <span className="text-black">{employee.department}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-500">Email:</span>
//                             <span className="text-black">{employee.email}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="text-gray-500">Join Date:</span>
//                             <span className="text-black">{new Date(employee.joinDate).toLocaleDateString()}</span>
//                           </div>
//                         </div>
//                       </CardContent>
//                       <CardFooter className="flex justify-end">
//                         <Button
//                           className="bg-[#236294] text-white hover:bg-[#236294]/90"
//                           onClick={() => setSelectedEmployee(employee)}
//                         >
//                           View Details
//                         </Button>
//                       </CardFooter>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <AnimatePresence>
//         {selectedEmployee && (
//           <motion.div
//             layoutId={`card-${selectedEmployee.id}`}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setSelectedEmployee(null)}
//           >
//             <motion.div
//               className="relative w-full max-w-2xl bg-white rounded-lg p-6 m-4"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute right-4 top-4"
//                 onClick={() => setSelectedEmployee(null)}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//               <div className="grid gap-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-black">{selectedEmployee.name}</h2>
//                   <p className="text-gray-500">{selectedEmployee.role}</p>
//                 </div>
//                 <div className="grid gap-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <h3 className="font-semibold text-black">Department</h3>
//                       <p className="text-gray-500">{selectedEmployee.department}</p>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-black">Join Date</h3>
//                       <p className="text-gray-500">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-black">Email</h3>
//                     <p className="text-gray-500">{selectedEmployee.email}</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, UserPlus, X } from "lucide-react"
import { useState, useEffect } from "react"
import Sidebar from "../component/Sidebar"
import { Button } from "../component/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",  // Fix here
    address: "",
    dateOfBirth: "",
  });
  

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Fetch employee data from backend on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5023/api/employee", {
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
          },
        })
        
        if (!response.ok) {
          throw new Error("Failed to fetch employees data")
        }

        const data = await response.json()
        setEmployees(data) 
      } catch (error) {
        toast.error(error.message)
      }
    }

    fetchEmployees()
  }, [])

  // Handle adding a new employee
  const handleAddEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.phoneNumber || !newEmployee.address || !newEmployee.dateOfBirth) {
      toast.error("Please fill in all required fields");
      return;
    }
  
    const employeeData = {
      firstName: newEmployee.firstName,
      lastName: newEmployee.lastName,
      dateOfBirth: new Date(newEmployee.dateOfBirth).toISOString(),
      email: newEmployee.email,
      phoneNumber: newEmployee.phoneNumber,
      address: newEmployee.address,
    };
  
    try {
      console.log("Sending data:", employeeData);
      const response = await fetch("http://localhost:5023/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });
  
      if (!response.ok) throw new Error(`Failed: ${response.statusText}`);
  
      const addedEmployee = await response.json();
      setEmployees([...employees, addedEmployee]);
      setNewEmployee({ firstName: "", lastName: "", email: "", phoneNumber: "", address: "", dateOfBirth: "" });
      setIsAddDialogOpen(false);
      toast.success("Employee added successfully");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(`Error: ${error.message}`);
    }
  };
  
  

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen">
      <div className="w-72 fixed inset-y-0 left-0 bg-[#121828] text-white shadow-lg z-30">
        <Sidebar />
      </div>
      <main className="flex-1 ml-72 bg-[#f7f7f7]">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-black">Employee Management</h1>
                  <p className="text-gray-500">Manage your team members and their roles</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#236294] text-white hover:bg-[#236294]/90">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Employee
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Employee</DialogTitle>
                      <DialogDescription>Enter the details of the new employee below</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">First Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={newEmployee.firstName}
                          required
                          onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Last Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={newEmployee.lastName}
                          required
                          onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={newEmployee.email}
                          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        />
                      </div>
                     
                     
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="Enter phone number"
                          value={newEmployee.phoneNumber}
                          onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}

                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="Enter address"
                          value={newEmployee.address}
                          onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={newEmployee.dateOfBirth}
                          onChange={(e) => setNewEmployee({ ...newEmployee, dateOfBirth: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#236294] text-white hover:bg-[#236294]/90" onClick={handleAddEmployee }>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {filteredEmployees.map((employee) => (
                    <motion.div
                      key={employee.id}
                      variants={item}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                    >
                      <Card className="bg-white shadow-md">
                        <CardHeader>
                          <CardTitle>{employee.name}</CardTitle>
                          <CardDescription>{employee.role}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-500">Email: {employee.email}</div>
                          <div className="text-sm text-gray-500">Department: {employee.department}</div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            onClick={() => setSelectedEmployee(employee)}
                            className="text-blue-500"
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
