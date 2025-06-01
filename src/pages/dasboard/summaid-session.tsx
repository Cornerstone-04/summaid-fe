import type React from "react";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileText, Mic, Send, Upload, X, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface StudySessionProps {
  id: string;
}

export function StudySession({ id }: StudySessionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<string[]>([
    "AI_Education_Insights.pdf",
    "Neuroscience_of_Learning.docx",
    "UX_Design_Principles_2025.pdf",
    "Quantum_Computing_Basics.txt",
    "Pdf-1.pdf",
  ]);
  const [activeTab, setActiveTab] = useState("key-points");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'll scan through the document and give you a high-level summary first, then we can break it down further if needed.",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []).map((file) => file.name);
    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter((file) => file !== fileName));
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-64 border-r bg-white flex flex-col">
          <Collapsible defaultOpen className="border-b">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-sm font-medium">
              <span>Data sources</span>
              <span className="text-xs text-gray-500">
                Max of 5 attachments
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 border-t border-dashed flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5 text-gray-500" />
                </div>
                <button
                  onClick={handleFileUpload}
                  className="text-sm text-blue-600 font-medium"
                >
                  Click to upload
                </button>
                <span className="text-xs text-gray-500">or drag and drop</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              </div>

              <div className="px-4 pb-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
                      <span className="truncate max-w-[180px]">{file}</span>
                    </div>
                    <button onClick={() => removeFile(file)}>
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible defaultOpen className="border-b">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-sm font-medium">
              <span>Study tools available</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Audio Study</h4>
                    <p className="text-xs text-gray-500">
                      Convert document to voice notes
                    </p>
                  </div>
                  <Switch id="audio-study" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Explainer Study</h4>
                    <p className="text-xs text-gray-500">
                      Clarify complex topics in seconds
                    </p>
                  </div>
                  <Switch id="explainer-study" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Flashcards</h4>
                    <p className="text-xs text-gray-500">
                      Test questions from your study
                    </p>
                  </div>
                  <Switch id="flashcards" />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="border-b">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-sm font-medium">
              <span>Audio study preference</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-4 pb-4">
                <h4 className="text-sm font-medium mb-2">Voice Tone</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Friendly", "Lecturer", "Casual", "User", "Academic"].map(
                    (tone) => (
                      <Button
                        key={tone}
                        variant={tone === "Friendly" ? "default" : "outline"}
                        size="sm"
                        className="rounded-full text-xs"
                      >
                        {tone}
                      </Button>
                    )
                  )}
                </div>

                <h4 className="text-sm font-medium mb-2">Playback speed</h4>
                <div className="flex flex-wrap gap-2">
                  {["0.5x", "1.0x", "1.5x", "2.0x", "2.5x"].map((speed) => (
                    <Button
                      key={speed}
                      variant={speed === "1.0x" ? "default" : "outline"}
                      size="sm"
                      className="rounded-full text-xs"
                    >
                      {speed}
                    </Button>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="border-b">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-sm font-medium">
              <span>Explainer study preference</span>
            </CollapsibleTrigger>
          </Collapsible>

          <Collapsible className="border-b">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-sm font-medium">
              <span>Flashcards preference</span>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-3xl mx-auto">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-medium mb-2">
                    Upload your notes
                  </h2>
                  <p className="text-gray-500 mb-4">to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.role === "user"
                            ? "bg-blue-50 rounded-lg p-3"
                            : ""
                        }`}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          {message.role === "assistant" && (
                            <div className="font-medium mb-1">
                              StudySphere AI
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {messages.length > 0 && !isLoading && (
                    <div className="border rounded-lg overflow-hidden">
                      <Tabs
                        defaultValue="key-points"
                        value={activeTab}
                        onValueChange={setActiveTab}
                      >
                        <div className="border-b px-4">
                          <TabsList className="h-10 bg-transparent">
                            <TabsTrigger
                              value="key-points"
                              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                            >
                              Key points
                            </TabsTrigger>
                            <TabsTrigger
                              value="flashcards"
                              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                            >
                              Flashcards
                            </TabsTrigger>
                            <TabsTrigger
                              value="audio"
                              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
                            >
                              Audio
                            </TabsTrigger>
                          </TabsList>
                        </div>

                        <TabsContent
                          value="key-points"
                          className="p-4 space-y-4"
                        >
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-purple-500" />
                            <h3 className="font-medium">High-Level Summary</h3>
                            <Button
                              variant="link"
                              size="sm"
                              className="ml-auto"
                            >
                              Expand
                            </Button>
                          </div>

                          <p className="text-sm">
                            The article discusses the rise of AI in educational
                            settings. It emphasizes the benefits of personalized
                            learning, real-time feedback systems, and workload
                            automation for educators. It also warns about
                            challenges like algorithmic bias and data privacy
                            concerns.
                          </p>

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                            >
                              <Mic className="h-4 w-4 mr-1" />
                              Listen
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                            >
                              <BookOpen className="h-4 w-4 mr-1" />
                              Explain
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-medium mb-3">
                              Key Points Extracted
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-sm">
                                  Personalized Learning:
                                </h4>
                                <p className="text-sm text-gray-600">
                                  AI adapts to individual learning styles,
                                  pacing, and progress to enhance learning
                                  efficiency.
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium text-sm">
                                  Feedback Automation:
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Systems powered by AI can give instant
                                  feedback, reducing grading time for teachers.
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium text-sm">
                                  Teacher Support:
                                </h4>
                                <p className="text-sm text-gray-600">
                                  AI can automate admin tasks, allowing teachers
                                  to focus more on teaching and mentoring.
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium text-sm">
                                  Ethical Risks:
                                </h4>
                                <p className="text-sm text-gray-600">
                                  There's a need for regulation to prevent
                                  unfair algorithmic decisions and misuse of
                                  student data.
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium text-sm">
                                  Data Privacy:
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Concerns exist around how much student data is
                                  collected and how it's stored or shared.
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium text-sm">
                                  Equity Issues:
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Not all schools have equal access to AI, which
                                  may widen the learning gap.
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="flashcards" className="p-4">
                          <div className="text-center p-8">
                            <h3 className="font-medium mb-2">Flashcards</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Generate flashcards from your lecture content to
                              test your knowledge
                            </p>
                            <Button>Create Flashcards</Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="audio" className="p-4">
                          <div className="text-center p-8">
                            <h3 className="font-medium mb-2">Audio Recap</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Convert your lecture content to audio for
                              on-the-go learning
                            </p>
                            <Button>Generate Audio</Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t p-4">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Textarea
                  placeholder="Use me to enter your notes or ask me anything about your material..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[100px] pr-12 resize-none"
                />
                <Button
                  size="icon"
                  className="absolute bottom-3 right-3"
                  onClick={handleSend}
                  disabled={isLoading || input.trim() === ""}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>

              <div className="flex justify-center gap-2 mt-2">
                <Button variant="outline" size="sm">
                  Summarize note
                </Button>
                <Button variant="outline" size="sm">
                  Create flashcards
                </Button>
                <Button variant="outline" size="sm">
                  Research
                </Button>
                <Button variant="outline" size="sm">
                  Explain more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
