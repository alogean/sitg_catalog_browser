import rdflib

g=rdflib.Graph()
g.load('sitg_skos_model_v2_rdf.xml')

for s,p,o in g: 
  print s,p,o