import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Card } from "./ui/card";
import { Upload, X } from "lucide-react";
import { ContentType } from "../types";

interface UploadFormProps {
  onSubmit: (data: {
    title: string;
    contentType: ContentType;
    description: string;
    tags: string[];
    date: string;
    fileName: string;
    confidential: boolean;
  }) => void;
  onCancel?: () => void;
}

export function UploadForm({ onSubmit, onCancel }: UploadFormProps) {
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<ContentType>("press_release");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fileName, setFileName] = useState("");
  const [confidential, setConfidential] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      contentType,
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      date,
      fileName: fileName || 'untitled_document.pdf',
      confidential,
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setTags("");
    setFileName("");
    setConfidential(false);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-gray-900 mb-1">Upload New Content</h2>
          <p className="text-gray-600 text-sm">
            Submit communication materials for MICAT review and approval
          </p>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Content Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title"
              required
            />
          </div>

          {/* Content Type */}
          <div>
            <Label htmlFor="contentType">Content Type *</Label>
            <Select
              value={contentType}
              onValueChange={(value) => setContentType(value as ContentType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="press_release">Press Release</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="speech">Speech</SelectItem>
                <SelectItem value="photo">Photo</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description / Summary *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of the content"
              rows={4}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags / Keywords</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="health, policy, announcement (comma-separated)"
            />
            <p className="text-gray-500 text-xs mt-1">Separate tags with commas</p>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="file">Upload File *</Label>
            <div className="mt-2">
              <label
                htmlFor="file"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  {fileName ? (
                    <div>
                      <p className="text-gray-700">{fileName}</p>
                      <p className="text-gray-500 text-xs mt-1">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600">Click to upload file</p>
                      <p className="text-gray-500 text-xs mt-1">PDF, DOCX, JPG, MP4, etc.</p>
                    </div>
                  )}
                </div>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  required
                />
              </label>
            </div>
          </div>

          {/* Confidential Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="confidential" className="cursor-pointer">
                Confidential Content
              </Label>
              <p className="text-gray-500 text-xs mt-1">
                Mark if this content contains sensitive information
              </p>
            </div>
            <Switch
              id="confidential"
              checked={confidential}
              onCheckedChange={setConfidential}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" className="bg-blue-900 hover:bg-blue-950">
            Submit for Review
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
