'use client'

import { Button, Checkbox, TextField } from "@/components/ui";
import { IconPlus, IconTrash } from "justd-icons";
import React, { useEffect, useState } from "react";
import { Task } from "@/types/task";

export default function Home() {
    const [taskInput, setTaskInput] = useState('');
    const [tasksToDo, setTasksToDo] = useState<Task[]>([]);
    const [tasksDone, setTasksDone] = useState<Task[]>([]);

    // Récupérer les tâches depuis le localStorage au démarrage
    useEffect(() => {
        const savedTasksToDo = localStorage.getItem("tasksToDo");
        const savedTasksDone = localStorage.getItem("tasksDone");

        if (savedTasksToDo) {
            setTasksToDo(JSON.parse(savedTasksToDo));
        }
        if (savedTasksDone) {
            setTasksDone(JSON.parse(savedTasksDone));
        }
    }, []);

    // Sauvegarder les tâches dans le localStorage chaque fois qu'elles changent
    useEffect(() => {
        localStorage.setItem("tasksToDo", JSON.stringify(tasksToDo));
        localStorage.setItem("tasksDone", JSON.stringify(tasksDone));
    }, [tasksToDo, tasksDone]);

    // Ajouter une tâche
    function addTask() {
        if (taskInput.trim()) {
            const newTask: Task = { id: tasksToDo.length, title: taskInput, completed: false };
            setTasksToDo(prevTasks => [...prevTasks, newTask]);
            setTaskInput(""); // Réinitialiser le champ
        }
    }

    // Supprimer une tâche de "to do" ou "done"
    function deleteTask(index: number, isDone: boolean) {
        if (isDone) {
            setTasksDone(prevTasks => prevTasks.filter((_, i) => i !== index));
        } else {
            setTasksToDo(prevTasks => prevTasks.filter((_, i) => i !== index));
        }
    }

    // Déplacer une tâche de "to do" à "done" et vice versa
    function toggleTask(index: number, isDone: boolean) {
        if (isDone) {
            const taskToToggle = tasksDone[index];
            taskToToggle.completed = false; // Démarquer comme terminé

            // Déplacer de done à to do
            setTasksDone(prevTasks => prevTasks.filter((_, i) => i !== index));
            setTasksToDo(prevTasks => [...prevTasks, taskToToggle]);
        } else {
            const taskToToggle = tasksToDo[index];
            taskToToggle.completed = true; // Marquer comme terminé

            // Déplacer de to do à done
            setTasksToDo(prevTasks => prevTasks.filter((_, i) => i !== index));
            setTasksDone(prevTasks => [...prevTasks, taskToToggle]);
        }
    }

    // Gérer le changement de la valeur de tâche à ajouter
    function handleTaskInputChange(e: string) {
        setTaskInput(e);
    }

    return (
        <div className='max-w-2xl mx-auto items-center justify-center min-h-screen flex flex-col'>
            <h1 className='text-[75px] mb-4' style={{ fontFamily: "Darlington" }}>To Do List</h1>
            <TextField
                placeholder='Enter a task you must complete..'
                className='mb-4 w-full'
                value={taskInput}
                onChange={(e) => handleTaskInputChange(e)}
                suffix={
                    <Button
                        aria-label="New Task"
                        intent="outline"
                        onPress={addTask}
                    >
                        <IconPlus />
                    </Button>
                }
            />
            <div className='flex gap-4 w-full'>
                <div className='w-1/2 space-y-2'>
                    <h2 className='font-bold text-lg'>Tasks to do :</h2>
                    {tasksToDo.map((item, i) => (
                        <div key={i} className='flex items-center justify-between bg-neutral-900 border rounded-xl p-2'>
                            <div className='flex ml-2'>
                                <Checkbox
                                    isSelected={item.completed}
                                    onChange={() => toggleTask(i, false)} // false => to do
                                />
                                {item.title}
                            </div>
                            <Button aria-label="Delete Task" intent="outline" onPress={() => deleteTask(i, false)}>
                                <IconTrash />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className='w-1/2 space-y-2'>
                    <h2 className='font-bold text-lg'>Tasks done :</h2>
                    {tasksDone.map((item, i) => (
                        <div key={i} className='flex items-center justify-between bg-neutral-900 border rounded-xl p-2'>
                            <div className='flex ml-2'>
                                <Checkbox
                                    isSelected={item.completed}
                                    onChange={() => toggleTask(i, true)} // true => done
                                />
                                {item.title}
                            </div>
                            <Button aria-label="Delete Task" intent="outline" onPress={() => deleteTask(i, true)}>
                                <IconTrash />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
