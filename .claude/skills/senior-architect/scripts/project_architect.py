#!/usr/bin/env python3
"""
Project Architect
Automated tool for senior architect tasks in Flutter/Dart projects
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, List, Any
import re

class ProjectArchitect:
    """Main class for project architect functionality"""
    
    def __init__(self, target_path: str, verbose: bool = False):
        self.target_path = Path(target_path).resolve()
        self.verbose = verbose
        self.results: Dict[str, Any] = {
            'status': 'pending',
            'target': str(self.target_path),
            'findings': [],
            'metrics': {},
            'architecture': {}
        }
    
    def run(self) -> Dict:
        """Execute the main functionality"""
        print(f"Running {self.__class__.__name__}...")
        print(f"Target: {self.target_path}")
        
        try:
            self.validate_target()
            self.analyze()
            self.generate_report()
            
            print("Completed successfully!")
            return self.results
            
        except Exception as e:
            print(f"Error: {e}")
            if self.verbose:
                import traceback
                traceback.print_exc()
            sys.exit(1)
    
    def validate_target(self):
        """Validate the target path exists and is accessible"""
        if not self.target_path.exists():
            raise ValueError(f"Target path does not exist: {self.target_path}")
        
        if self.verbose:
            print(f"✓ Target validated: {self.target_path}")
    
    def analyze(self):
        """Perform the main analysis on the project"""
        if self.verbose:
            print("Analyzing project architecture...")
        
        # Determine if it's a flutter project
        pubspec_path = self.target_path / "pubspec.yaml"
        if not pubspec_path.exists() and (self.target_path.parent / "pubspec.yaml").exists():
            pubspec_path = self.target_path.parent / "pubspec.yaml"
            
        is_flutter = pubspec_path.exists()
        
        if is_flutter:
            self._analyze_pubspec(pubspec_path)
            
        self._analyze_directory_structure()
        self._calculate_metrics()
        
        self.results['status'] = 'success'
        
        if self.verbose:
            print(f"✓ Analysis complete: {len(self.results.get('findings', []))} findings")
            
    def _analyze_pubspec(self, pubspec_path: Path):
        """Extract basic info from pubspec.yaml"""
        try:
            content = pubspec_path.read_text(encoding='utf-8')
            
            name_match = re.search(r'^name:\s*(.+)$', content, re.MULTILINE)
            if name_match:
                self.results['architecture']['project_name'] = name_match.group(1).strip()
                
            # Find dependencies
            deps_section = re.search(r'^dependencies:.*?(?=^[a-zA-Z_]+:|\Z)', content, re.MULTILINE | re.DOTALL)
            if deps_section:
                deps = re.findall(r'^\s+([a-zA-Z0-9_]+):', deps_section.group(0), re.MULTILINE)
                self.results['architecture']['dependencies'] = [d for d in deps if d != 'flutter']
        except Exception as e:
            if self.verbose:
                print(f"Warning parsing pubspec.yaml: {e}")
                
    def _analyze_directory_structure(self):
        """Identify architectural layers based on folder structure"""
        lib_dir = self.target_path if self.target_path.name == 'lib' else self.target_path / 'lib'
        if not lib_dir.exists():
            return
            
        layers = []
        for item in lib_dir.iterdir():
            if item.is_dir() and not item.name.startswith('.'):
                layers.append(item.name)
                
        self.results['architecture']['layers'] = layers
        
        # Add a finding if key layers are missing
        expected_layers = {'models', 'views', 'controllers', 'services'}
        found_layers = set(layers)
        missing = expected_layers - found_layers
        
        if missing:
            self.results['findings'].append({
                'type': 'architecture',
                'severity': 'info',
                'message': f"Common architectural layers missing: {', '.join(missing)}"
            })
            
    def _calculate_metrics(self):
        """Calculate LOC and file counts"""
        total_files = 0
        total_loc = 0
        large_files = []
        
        for ext in ('*.dart',):
            for file_path in self.target_path.rglob(ext):
                if '.dart_tool' in str(file_path) or 'build' in str(file_path):
                    continue
                    
                total_files += 1
                try:
                    lines = sum(1 for line in open(file_path, 'r', encoding='utf-8') if line.strip())
                    total_loc += lines
                    if lines > 300:  # Threshold for "large" file
                        large_files.append((file_path.relative_to(self.target_path), lines))
                except UnicodeDecodeError:
                    pass
                    
        self.results['metrics'] = {
            'total_dart_files': total_files,
            'total_loc': total_loc,
            'avg_loc_per_file': round(total_loc / total_files) if total_files > 0 else 0
        }
        
        for lf, lines in sorted(large_files, key=lambda x: x[1], reverse=True)[:5]:
             self.results['findings'].append({
                'type': 'maintainability',
                'severity': 'warning',
                'message': f"Large file detected: {lf} ({lines} lines)"
            })
    
    def generate_report(self):
        """Generate and display the report"""
        print("\n" + "="*50)
        print("ARCHITECTURE REPORT")
        print("="*50)
        print(f"Target: {self.results.get('target')}")
        print(f"Status: {self.results.get('status')}")
        
        arch = self.results.get('architecture', {})
        if 'project_name' in arch:
            print(f"Project Name: {arch['project_name']}")
        if 'layers' in arch:
            print(f"Discovered Layers: {', '.join(arch['layers'])}")
            
        metrics = self.results.get('metrics', {})
        if metrics:
            print("\nMetrics:")
            print(f"  Total Dart Files: {metrics.get('total_dart_files')}")
            print(f"  Total Lines of Code: {metrics.get('total_loc')}")
            print(f"  Avg Lines/File: {metrics.get('avg_loc_per_file')}")
            
        findings = self.results.get('findings', [])
        print(f"\nFindings ({len(findings)}):")
        for i, finding in enumerate(findings, 1):
            sev = finding.get('severity', 'info').upper()
            print(f"  {i}. [{sev}] {finding.get('message')}")
            
        print("="*50 + "\n")

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description="Project Architect - Codebase Analysis Tool"
    )
    parser.add_argument(
        'target',
        nargs='?',
        default='.',
        help='Target path to analyze (default: current directory)'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose output'
    )
    parser.add_argument(
        '--json',
        action='store_true',
        help='Output results as JSON'
    )
    parser.add_argument(
        '--output', '-o',
        help='Output file path'
    )
    
    args = parser.parse_args()
    
    tool = ProjectArchitect(
        args.target,
        verbose=args.verbose
    )
    
    results = tool.run()
    
    if args.json:
        output = json.dumps(results, indent=2)
        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(output)
            print(f"Results written to {args.output}")
        else:
            print(output)

if __name__ == '__main__':
    main()
