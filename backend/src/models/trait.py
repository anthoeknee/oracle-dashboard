from pydantic import BaseModel
from enum import Enum

class TraitType(str, Enum):
    EMOTION = "emotion"
    TRAIT = "trait"

class TraitSchema(BaseModel):
    name: str
    value: float
    type: TraitType