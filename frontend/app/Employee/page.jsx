// "use client"

// import { motion } from "framer-motion"
// import { Plus, Search, Trash2, UserPlus } from "lucide-react"
// import { useState } from "react"
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
//     <div className="min-h-screen bg-[#f7f7f7] p-8">
//        <div className="w-72 h-screen fixed top-0 left-0 bg-[#121828] text-white shadow-lg">
//         <Sidebar />
//       </div>     
//       <div className="mx-auto max-w-7xl">
        
//         <div className="flex flex-col gap-6">
//           <div className="flex items-center justify-between">
            
//             <div>
              
//               <h1 className="text-2xl font-bold text-black">Employee Management</h1>
//               <p className="text-secondary">Manage your team members and their roles</p>
//             </div>
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
//                   <UserPlus className="mr-2 h-4 w-4" />
//                   Add Employee
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                   <DialogTitle>Add New Employee</DialogTitle>
//                   <DialogDescription>Enter the details of the new employee below</DialogDescription>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="name">Full Name</Label>
//                     <Input id="name" placeholder="Enter full name" />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input id="email" type="email" placeholder="Enter email address" />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="role">Role</Label>
//                     <Input id="role" placeholder="Enter job title" />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="department">Department</Label>
//                     <Select>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select department" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="engineering">Engineering</SelectItem>
//                         <SelectItem value="product">Product</SelectItem>
//                         <SelectItem value="design">Design</SelectItem>
//                         <SelectItem value="marketing">Marketing</SelectItem>
//                         <SelectItem value="sales">Sales</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <div className="flex justify-end">
//                   <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Add Employee
//                   </Button>
//                 </div>
//               </DialogContent>
//             </Dialog>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//               <Input
//                 className="pl-10"
//                 placeholder="Search employees..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
           
//           </div>

//           <Separator className="my-4" />

//           <motion.div
//             variants={container}
//             initial="hidden"
//             animate="show"
//             className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
//           >
//             {employees.map((employee) => (
//               <motion.div key={employee.id} variants={item}>
//                 <Card className=" bg-white group relative overflow-hidden transition-all hover:shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="text-black flex items-center justify-between">
//                       {employee.name}
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="opacity-0 transition-opacity group-hover:opacity-100"
//                       >
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </CardTitle>
//                     <CardDescription>{employee.role}</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid gap-2 text-sm">
//                       <div className="text-black flex justify-between">
//                         <span className="text-gray-500">Department:</span>
//                         <span>{employee.department}</span>
//                       </div>
//                       <div className="text-black flex justify-between">
//                         <span className="text-gray-500">Email:</span>
//                         <span>{employee.email}</span>
//                       </div>
//                       <div className="text-black flex justify-between">
//                         <span className="text-gray-500">Join Date:</span>
//                         <span>{new Date(employee.joinDate).toLocaleDateString()}</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                   <CardFooter className="flex justify-end">
//                     <Button variant="outline" size="sm">
//                       View Details
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { motion } from "framer-motion"
import { Plus, Search, UserPlus } from "lucide-react"
import { useState } from "react"
import Sidebar from "../component/Sidebar"
import { Button } from "../component/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

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
const employees = [
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
  const [searchTerm, setSearchTerm] = useState("")

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
                <Button className="bg-[#236294] text-white hover:bg-[#236294]/90">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
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
                {employees.map((employee) => (
                  <motion.div key={employee.id} variants={item}>
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
                        <Button className="bg-[#236294] text-white hover:bg-[#236294]/90">View Details</Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Employee Dialog */}
      <Dialog>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Enter the details of the new employee below</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter full name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" placeholder="Enter job title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

