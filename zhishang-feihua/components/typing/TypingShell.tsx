"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParagraphDrill } from "@/components/typing/ParagraphDrill";
import { WordDrill } from "@/components/typing/WordDrill";

export function TypingShell() {
  return (
    <Tabs defaultValue="words" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="words">詞語</TabsTrigger>
        <TabsTrigger value="paragraph">段落</TabsTrigger>
      </TabsList>
      <TabsContent value="words">
        <WordDrill />
      </TabsContent>
      <TabsContent value="paragraph">
        <ParagraphDrill />
      </TabsContent>
    </Tabs>
  );
}
