"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileUp, Link2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export function UploadButton() {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  const [jsonData, setJsonData] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    setIsUploading(true)
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false)
      setSelectedFile(null)
      setUrl("")
      setJsonData("")
      // Close dialog would happen here
    }, 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Data</DialogTitle>
          <DialogDescription>Upload your data for bias analysis</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="space-y-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="file">Upload CSV or JSON File</Label>
              <div className="flex items-center gap-2">
                <Input id="file" type="file" accept=".csv,.json" onChange={handleFileChange} />
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="url" className="space-y-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="url">Data URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/data.csv"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <Link2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="json" className="space-y-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="json">JSON Data</Label>
              <Textarea
                id="json"
                placeholder='{"data": [{"name": "John", "age": 30}]}'
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={isUploading || (!selectedFile && !url && !jsonData)}>
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
