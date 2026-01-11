from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.nodes import clause_extraction_node, risk_analysis_node, summarize_node, lifecycle_node

# Define the graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("extract_clauses", clause_extraction_node)
workflow.add_node("analyze_risks", risk_analysis_node)
workflow.add_node("lifecycle_analysis", lifecycle_node)
workflow.add_node("summarize", summarize_node)

# Define edges
# Flow: Extract -> Analyze -> Lifecycle -> Summarize -> End
workflow.set_entry_point("extract_clauses")
workflow.add_edge("extract_clauses", "analyze_risks")
workflow.add_edge("analyze_risks", "lifecycle_analysis")
workflow.add_edge("lifecycle_analysis", "summarize")
workflow.add_edge("summarize", END)

# Compile the graph
app_graph = workflow.compile()
