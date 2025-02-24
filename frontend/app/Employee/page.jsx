

// "use client"

// import { motion } from "framer-motion"
// import { Plus, Search, UserPlus } from "lucide-react"
// import { useState } from "react"
// import Sidebar from "../component/Sidebar"
// import { Button } from "../component/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"

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

// // Mock data - replace with actual data later
// const employees = [
//   {
//     id: 1,
//     name: "Alex Johnson",
//     role: "Software Engineer",
//     department: "Engineering",
//     email: "alex.j@company.com",
//     joinDate: "2023-01-15",
//   },
//   {
//     id: 2,
//     name: "Sarah Williams",
//     role: "Product Manager",
//     department: "Product",
//     email: "sarah.w@company.com",
//     joinDate: "2023-03-20",
//   },
//   {
//     id: 3,
//     name: "Michael Chen",
//     role: "UX Designer",
//     department: "Design",
//     email: "michael.c@company.com",
//     joinDate: "2023-06-10",
//   },
// ]

// export default function EmployeeDashboard() {
//   const [searchTerm, setSearchTerm] = useState("")

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
//                 <Button className="bg-[#236294] text-white hover:bg-[#236294]/90">
//                   <UserPlus className="mr-2 h-4 w-4" />
//                   Add Employee
//                 </Button>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//                   <Input
//                     className="pl-10 bg-white border-0"
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
//                 {employees.map((employee) => (
//                   <motion.div key={employee.id} variants={item}>
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
//                         <Button className="bg-[#236294] text-white hover:bg-[#236294]/90">View Details</Button>
//                       </CardFooter>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Add Employee Dialog */}
//       <Dialog>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Add New Employee</DialogTitle>
//             <DialogDescription>Enter the details of the new employee below</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input id="name" placeholder="Enter full name" />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" placeholder="Enter email address" />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="role">Role</Label>
//               <Input id="role" placeholder="Enter job title" />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="department">Department</Label>
//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select department" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="engineering">Engineering</SelectItem>
//                   <SelectItem value="product">Product</SelectItem>
//                   <SelectItem value="design">Design</SelectItem>
//                   <SelectItem value="marketing">Marketing</SelectItem>
//                   <SelectItem value="sales">Sales</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="flex justify-end">
//             <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
//               <Plus className="mr-2 h-4 w-4" />
//               Add Employee
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, UserPlus, X } from "lucide-react"
import { useState } from "react"
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

// Mock data - replace with actual data later
const initialEmployees = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Software Engineer",
    department: "Engineering",
    email: "alex.j@company.com",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Product Manager",
    department: "Product",
    email: "sarah.w@company.com",
    joinDate: "2023-03-20",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "UX Designer",
    department: "Design",
    email: "michael.c@company.com",
    joinDate: "2023-06-10",
  },
]

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.role || !newEmployee.department) {
      toast.error("Please fill in all fields")
      return
    }

    const employee = {
      id: employees.length + 1,
      ...newEmployee,
      joinDate: new Date().toISOString().split("T")[0],
    }

    setEmployees([...employees, employee])
    setNewEmployee({ name: "", email: "", role: "", department: "" })
    setIsAddDialogOpen(false)
    toast.success("Employee added successfully")
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
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
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={newEmployee.name}
                          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
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
                        <Label htmlFor="role">Role</Label>
                        <Input
                          id="role"
                          placeholder="Enter job title"
                          value={newEmployee.role}
                          onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={newEmployee.department}
                          onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Product">Product</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#236294] text-white hover:bg-[#236294]/90" onClick={handleAddEmployee}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    className="pl-10 bg-white border-0"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredEmployees.map((employee) => (
                  <motion.div key={employee.id} variants={item} layoutId={`card-${employee.id}`}>
                    <Card className="bg-white border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-black text-xl font-semibold">{employee.name}</CardTitle>
                        <CardDescription className="text-gray-500">{employee.role}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Department:</span>
                            <span className="text-black">{employee.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Email:</span>
                            <span className="text-black">{employee.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Join Date:</span>
                            <span className="text-black">{new Date(employee.joinDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button
                          className="bg-[#236294] text-white hover:bg-[#236294]/90"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            layoutId={`card-${selectedEmployee.id}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl bg-white rounded-lg p-6 m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setSelectedEmployee(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="grid gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-black">{selectedEmployee.name}</h2>
                  <p className="text-gray-500">{selectedEmployee.role}</p>
                </div>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-black">Department</h3>
                      <p className="text-gray-500">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">Join Date</h3>
                      <p className="text-gray-500">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Email</h3>
                    <p className="text-gray-500">{selectedEmployee.email}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

