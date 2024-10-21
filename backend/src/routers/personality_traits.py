from fastapi import APIRouter, HTTPException
from typing import List
from src.models.trait import TraitSchema
from src.database.supabase_client import supabase
from src.websocket.connection_manager import manager

router = APIRouter()

@router.get("/traits", response_model=List[TraitSchema])
async def get_all_traits():
    response = supabase.table("personality_traits").select("name, value, type").execute()
    return response.data

@router.get("/traits/{trait_name}", response_model=TraitSchema)
async def get_trait(trait_name: str):
    response = supabase.table("personality_traits").select("name, value, type").eq("name", trait_name).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Trait not found")
    return response.data[0]

@router.post("/traits", response_model=TraitSchema)
async def create_trait(trait: TraitSchema):
    response = supabase.table("personality_traits").insert(trait.dict()).execute()
    await manager.broadcast("traitsUpdated")
    return response.data[0]

@router.put("/traits/{trait_name}", response_model=TraitSchema)
async def update_trait(trait_name: str, trait: TraitSchema):
    response = supabase.table("personality_traits").update({"value": trait.value, "type": trait.type}).eq("name", trait_name).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Trait not found")
    await manager.broadcast("traitsUpdated")
    return response.data[0]

@router.delete("/traits/{trait_name}")
async def delete_trait(trait_name: str):
    response = supabase.table("personality_traits").delete().eq("name", trait_name).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Trait not found")
    await manager.broadcast("traitsUpdated")
    return {"message": "Trait deleted successfully"}