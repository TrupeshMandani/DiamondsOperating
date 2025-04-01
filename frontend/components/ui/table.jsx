const Table = ({ className = "", ...props }) => {
    return (
      <div className="w-full overflow-auto">
        <table className={`w-full caption-bottom text-sm ${className}`} {...props} />
      </div>
    )
  }
  
  const TableHeader = ({ className = "", ...props }) => {
    return <thead className={`[&_tr]:border-b ${className}`} {...props} />
  }
  
  const TableBody = ({ className = "", ...props }) => {
    return <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
  }
  
  const TableFooter = ({ className = "", ...props }) => {
    return <tfoot className={`border-t bg-gray-100/50 font-medium dark:bg-gray-800/50 ${className}`} {...props} />
  }
  
  const TableRow = ({ className = "", ...props }) => {
    return (
      <tr
        className={`border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800 ${className}`}
        {...props}
      />
    )
  }
  
  const TableHead = ({ className = "", ...props }) => {
    return (
      <th
        className={`h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 [&:has([role=checkbox])]:pr-0 ${className}`}
        {...props}
      />
    )
  }
  
  const TableCell = ({ className = "", ...props }) => {
    return <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />
  }
  
  const TableCaption = ({ className = "", ...props }) => {
    return <caption className={`mt-4 text-sm text-gray-500 dark:text-gray-400 ${className}`} {...props} />
  }
  
  export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
  
  