'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const addSimulationSchema = z.object({
    name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
});

export type AddSimulationFormData = z.infer<typeof addSimulationSchema>;

interface AddSimulationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (name: string) => Promise<void>;
    sourceSimulationName?: string;
}

export function AddSimulationModal({
    open,
    onOpenChange,
    onSubmit,
    sourceSimulationName,
}: AddSimulationModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<AddSimulationFormData>({
        resolver: zodResolver(addSimulationSchema),
        defaultValues: {
            name: '',
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({ name: '' });
        }
    }, [open, form]);

    const handleSubmit = async (data: AddSimulationFormData) => {
        try {
            setIsSubmitting(true);
            await onSubmit(data.name);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border-[#333] text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Nova Simulação
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {sourceSimulationName
                            ? `Criar uma cópia de "${sourceSimulationName}" com um novo nome.`
                            : 'Digite o nome da nova simulação.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome da Simulação</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Cenário Otimista, Plano B..."
                                            {...field}
                                            className="bg-[#0f0f0f] border-[#333]"
                                            autoFocus
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="border-[#333] text-slate-300 hover:bg-[#262626] hover:text-white"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#48F7A1] text-black hover:bg-[#3AD88E]"
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Criar Simulação
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
