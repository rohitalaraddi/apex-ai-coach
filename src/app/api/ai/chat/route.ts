import { NextRequest, NextResponse } from 'next/server';
import { askAiCoach } from '@/lib/ai/gemini';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId } = await req.json();

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let convId = conversationId;
    if (!convId) {
      const newConv = await db.aiConversation.create({
        data: { title: message.substring(0, 40) + '...' },
      });
      convId = newConv.id;
    }

    // Save User Message
    await db.aiMessage.create({
      data: {
        conversationId: convId,
        role: 'user',
        content: message,
      },
    });

    // Ask Gemini AI Coach
    const coachRes = await askAiCoach(message);

    // Save Assistant Message
    const assistantMsg = await db.aiMessage.create({
      data: {
        conversationId: convId,
        role: 'assistant',
        content: coachRes.answer,
        groundedDataJson: JSON.stringify(coachRes.groundedMetrics || {}),
      },
    });

    return NextResponse.json({
      conversationId: convId,
      reply: coachRes.answer,
      groundedMetrics: coachRes.groundedMetrics,
      messageId: assistantMsg.id,
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
