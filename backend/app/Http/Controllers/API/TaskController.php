<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index() {
        return response()->json(Task::all());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'in:todo,in_progress,done'
        ]);
        $task = Task::create($validated);
        return response()->json($task, 201);
    }

    public function update(Request $request, $id) {
        $task = Task::findOrFail($id);
        $validated = $request->validate([
            'title' => 'string|max:255',
            'status' => 'in:todo,in_progress,done'
        ]);
        $task->update($validated);
        return response()->json($task);
    }
}