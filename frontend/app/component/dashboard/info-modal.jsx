"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const InfoModal = ({ title, items, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[300px] rounded-md border p-4 bg-white">
          {items && items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="p-3 bg-muted rounded-md">
                  {Object.entries(item).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-border last:border-0">
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span>{value?.toString()}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No items to display</p>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InfoModal

