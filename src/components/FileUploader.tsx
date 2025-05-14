
import { useState, useRef } from "react";
import { Upload, X, File, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FileUploaderProps {
  onUpload: (files: File[], text?: string) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onUpload, 
  onCancel,
  isOpen
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  const handleUpload = () => {
    onUpload(files, caption);
    resetForm();
  };
  
  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const resetForm = () => {
    setFiles([]);
    setCaption("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onCancel();
  };
  
  const isImage = (file: File) => file.type.startsWith('image/');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetForm()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {files.length === 0 ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Images, documents, videos supported
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {files.map((file, index) => (
                  <div key={index} className="relative border rounded-md p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 bg-white rounded-full z-10"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    {isImage(file) ? (
                      <div className="rounded-md overflow-hidden">
                        <AspectRatio ratio={1}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4">
                        <File className="h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-xs text-gray-500 truncate w-full text-center">
                          {file.name}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                className="w-full p-2 border rounded-md text-sm"
                rows={2}
              />
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploader;
